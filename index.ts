import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

// An ECS cluster to deploy into.
const cluster = new aws.ecs.Cluster("clusterPulumi", {});

// Create the ECR repository to store our container image
const repo = new awsx.ecr.Repository("repoPulumi", {
    forceDelete: true,
});

// Build and publish our application's container image from ./app to the ECR repository.
const image = new awsx.ecr.Image("nodeApp", {
    repositoryUrl: repo.url,
    path: "./app",
});

// Define the service and configure it to use our image and load balancer.
const vpc = new aws.ec2.Vpc("infrasityVpc", {
    cidrBlock: "10.0.0.0/16",
});

const subnet1 = new aws.ec2.Subnet("infrasitySubnet1", {
    vpcId: vpc.id,
    cidrBlock: "10.0.3.0/24",
    availabilityZone: "us-east-1a",
});

const subnet2 = new aws.ec2.Subnet("infrasitySubnet2", {
    vpcId: vpc.id,
    cidrBlock: "10.0.4.0/24",
    availabilityZone: "us-east-1b",
});

const loadBalancerSecurityGroup = new aws.ec2.SecurityGroup("infrasityLoadbalancerSg", {
    vpcId: vpc.id,
    ingress: [
        {
            protocol: "-1",
            self: false,
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
    egress: [
        {
            protocol: "-1",
            self: false,
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
});

const internetGateway = new aws.ec2.InternetGateway("infrasityInternetGateway", {
    vpcId: vpc.id,
});

const publicRouteTable = new aws.ec2.RouteTable("infrasityPublicRouteTable", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: "0.0.0.0/0",
        gatewayId: internetGateway.id,
    }],
});

const subnetAssociation = new aws.ec2.RouteTableAssociation("infrasitySubnetAssociation", {
    subnetId: subnet1.id,
    routeTableId: publicRouteTable.id,
});

const alb = new aws.lb.LoadBalancer("infrasityAlb", {
    loadBalancerType: "application",
    subnets: [subnet1.id, subnet2.id],
    securityGroups: [loadBalancerSecurityGroup.id],
});

const targetGroup = new aws.lb.TargetGroup("infrasityTargetGroup", {
    port: 80,
    protocol: "HTTP",
    targetType: "ip",
    vpcId: vpc.id,
    healthCheck: {
        path: "/",
        protocol: "HTTP",
    },
});

const listener = new aws.lb.Listener("infrasityListener", {
    loadBalancerArn: alb.arn,
    port: 80,
    defaultActions: [{
        type: "forward",
        targetGroupArn: targetGroup.arn,
    }],
});

const service = new awsx.ecs.FargateService("infrasityFargateService", {
    cluster: cluster.arn,
    desiredCount: 1,

    taskDefinitionArgs: {
        container: {
            name: "infrasityNodeApp",
            image: image.imageUri,
            cpu: 128,
            memory: 512,
            essential: true,
            portMappings: [{
                containerPort: 80,
                hostPort: 80,
            }],
        },
    },
    networkConfiguration: {
        subnets: [subnet1.id, subnet2.id],
        securityGroups: [loadBalancerSecurityGroup.id],
        assignPublicIp: true,
    },
    loadBalancers: [{
        targetGroupArn: targetGroup.arn,
        containerName: "infrasityNodeApp",
        containerPort: 80,
    }],
}, { dependsOn: [listener] });

export const url = pulumi.interpolate`http://${alb.dnsName}`;
