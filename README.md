# Infrasity Deployment

This repository contains the Pulumi configuration script written in TypeScript for deploying the Infrasity application on AWS ECS. Leveraging TypeScript allows for strong type checking and autocompletion, enhancing the development experience. The script establishes the necessary VPC, subnets, load balancer, and ECS services, leveraging both AWS and Pulumi resources to create a scalable and manageable infrastructure.

## Application Details

The application is a simple Node.js app served using Express.js. Below are the contents of the Dockerfile which sets up the environment:

```dockerfile
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Create a package.json file with the express dependency
RUN echo '{ "name": "simple-nodejs-app", "version": "1.0.0", "main": "index.js", "dependencies": { "express": "^4.17.1" }, "scripts": { "start": "node index.js" } }' > package.json

# Install app dependencies
RUN npm install

# Create a simple index.html file
RUN echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Hello World</title></head><body><h1>Hello World!</h1></body></html>' > index.html

# Create a simple index.js file
RUN echo 'const express = require("express"); const app = express(); const port = 80; app.get("/", (req, res) => { res.send("Hello World!"); }); app.listen(port, () => { console.log(`Node.js app listening at http://localhost:${port}`); });' > index.js

# Expose the app port
EXPOSE 80

# Start the app
CMD [ "npm", "start" ]
```

This Dockerfile accomplishes the following:

- Sets the base image to `node:14`.
- Sets the working directory in the container to `/usr/src/app`.
- Creates a `package.json` file with the express dependency.
- Installs the necessary dependencies using `npm install`.
- Creates a simple `index.html` file with a "Hello World" message.
- Sets up a basic Express.js server in an `index.js` file that serves the "Hello World" message at the root URL.
- Exposes port 80 to allow communication with the app.
- Defines the command to start the app using `npm start`.



## Resources Created

The Pulumi script will create 23 resources in total to fully set up and deploy the application. Here is a detailed list of the resources that will be created:

- **Pulumi Stack**
    - **AWS EC2 VPC**: `infrasityVpc`
    - **AWS ECS Cluster**: `clusterPulumi` and `cluster-pulumi` (to be deleted)
- **Networking**
    - **AWS EC2 Internet Gateway**: `infrasityInternetGateway`
    - **AWS EC2 Subnets**: `infrasitySubnet1` and `infrasitySubnet2`
    - **AWS EC2 Route Table**: `infrasityPublicRouteTable`
    - **AWS EC2 Route Table Association**: `infrasitySubnetAssociation`
- **Load Balancer**
    - **AWS Load Balancer**: `infrasityAlb`
    - **AWS Load Balancer Listener**: `infrasityListener`
    - **AWS Load Balancer Target Group**: `infrasityTargetGroup`
    - **AWS EC2 Security Group**: `infrasityLoadbalancerSg`
- **ECR**
    - **AWS ECR Repository**: `repoPulumi` with underlying resources:
        - **AWS ECR Repository**: `repopulumi`
        - **AWS ECR Lifecycle Policy**: `repopulumi`
- **ECS**
    - **AWS ECS Fargate Service**: `infrasityFargateService` with underlying resources:
        - **AWS ECS Task Definition**: `infrasityFargateService`
        - **AWS IAM Roles**:
            - `infrasityFargateService-execution`
            - `infrasityFargateService-task`
        - **AWS CloudWatch Log Group**: `infrasityFargateService`
        - **AWS IAM Role Policy Attachment**: `infrasityFargateService-execution-9a42f520`
        - **AWS ECS Service**: `infrasityFargateService`
- **Container**
    - **AWSX ECR Image**: `nodeApp`

For a more detailed view, you can check the Pulumi console using the following link: [Pulumi Console](https://app.pulumi.com/shan0809/devvvvvvvv/dev/previews/c79bcf8f-9b2d-4849-bc74-798e7e4bf380).


## Prerequisites

Ensure you have the following tools installed before proceeding:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [Pulumi](https://www.pulumi.com/docs/get-started/install/)

## Setup

1. **Install Dependencies**

   Navigate to the app directory and install the necessary npm packages:

   ```bash
   cd node-app
   npm install
   ```

2. **Configure AWS Credentials**

   Make sure that your AWS credentials are configured properly. You can configure it using the following command:

   ```bash
   pulumi configure aws:region <your-aws-region>
   ```

3. **Deploying with Pulumi**

   Navigate back to the project's root directory and run the following commands to deploy your infrastructure:

   ```bash
   cd ..
   pulumi up
   ```

   This command will provision all necessary AWS resources and deploy your application.

## Architecture

The deployment script sets up the following resources:

- **VPC**: Configured with a CIDR block of 10.0.0.0/16.
- **Subnets**: Two subnets are created in different availability zones to ensure high availability.
- **Application Load Balancer (ALB)**: Routes HTTP traffic to different ECS containers based on the incoming URL pattern.
- **ECS Cluster**: A cluster to hold your deployed services.
- **ECS Fargate Service**: An AWS Fargate service to manage your containers.

## Clean Up

To delete all resources created by Pulumi, use the following command:

```bash
pulumi destroy
```

## Support

For any assistance, feel free to open an issue on this repository.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
