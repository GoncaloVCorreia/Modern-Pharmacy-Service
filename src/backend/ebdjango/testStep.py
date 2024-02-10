import boto3



client = boto3.client('stepfunctions', region_name='us-east-1')

response = client.send_task_success(
    taskToken='your-task-token',
    output='{"response": 1}'
)

