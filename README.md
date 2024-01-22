#### Build the docker first

```bash
docker build -t my-nodejs-app .
docker tag my-nodejs-app:latest <aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-nodejs-app:latest
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.<region>.amazonaws.com
docker push <aws_account_id>.dkr.ecr.<region>.amazonaws.com/my-nodejs-app:latest
```

- Don't forget to change the <variable> in the cli

#### Setup Kubernetes on AWS

You can use Amazon EKS (Elastic Kubernetes Service) to manage your Kubernetes cluster. Follow the AWS documentation to create and configure an EKS cluster.

- Don't forget to change the <variable> in the `deployment.yml` and `service.yml`

#### Deploy to Kurbenetes

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```
