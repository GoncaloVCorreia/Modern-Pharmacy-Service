
from django.http import JsonResponse
from django.db import connections
import boto3
from botocore.exceptions import ClientError
import boto3
import os
from PIL import Image
import io
import json



def users_view(request):
   
    with connections['database-1'].cursor() as cursor:
        
      
        #cursor.execute("INSERT INTO users_data (email, username, password) VALUES ('ex@gmail.com', 'goncalo', '1234');")
        cursor.execute("SELECT * FROM users_data;")
        rows = cursor.fetchall()
        print(rows)
        users = []
        for row in rows:
            user = {
                'email': row[0],
                'username': row[1],
            }
            users.append(user)
    return JsonResponse(users, safe=False)

def register_view(request):
   
    if request.method == 'POST':
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(request.POST)

        try:
            with connections['database-1'].cursor() as cursor:
                cursor.execute("INSERT INTO users_data (email, username, password) VALUES (%s, %s, %s);", [email, username, password])
            
            return JsonResponse({'message': 'User registered successfully.'})
        except Exception as e:
            error_message = str(e)
            return JsonResponse({'message': 'Failed to register user.', 'error': error_message})

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            with connections['database-1'].cursor() as cursor:
                cursor.execute("SELECT * FROM users_data WHERE email = %s;", [email])
                row = cursor.fetchone()
            
            if row is not None and row[2] == password:
                user = {
                    'email': row[0],
                    'username': row[1],
                }
                return JsonResponse({'success': True, 'message': 'Login successful.', 'user': user})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid email or password.'})
        except Exception as e:
            error_message = str(e)
            return JsonResponse({'success': False, 'message': 'Failed to log in.', 'error': error_message})

def drugs_view(request):
    medicines = [
        ('Aspirin', 5.99, 'Y', [('Low-Dose Aspirin', 3.99), ('Extra Strength Aspirin', 6.99)]),
        ('Ibuprofen', 7.49, 'N', [('Children\'s Ibuprofen', 4.99), ('Ibuprofen Suspension', 5.99)]),
        ('Paracetamol', 3.99, 'N', [('Acetaminophen', 2.99)]),
        ('Lisinopril', 12.99, 'Y', [('Low-Dose Lisinopril', 9.99)]),
        ('Metformin', 9.99, 'Y', [('Low-Dose Metformin', 7.99), ('Extended Release Metformin', 12.99)]),
    ]

    
    return JsonResponse(medicines, safe=False)

def populate_face_view(request):
    s3 = boto3.resource('s3')
   
    print(os.getcwd())


    # Get list of objects for indexing
    images=[('ebdjango/image1.jpg','Elon Musk'),
        ('ebdjango/image2.jpg','Elon Musk'),
        ('ebdjango/image3.jpg','Bill Gates'),
        ('ebdjango/image4.jpg','Bill Gates'),
        ('ebdjango/image5.jpg','Sundar Pichai'),
        ('ebdjango/image6.jpg','Sundar Pichai')
      ]

    # Iterate through list to upload objects to S3   
    for image in images:
        file = open(image[0],'rb')
        object = s3.Object('famous-persons-es-2023-images','index/'+ image[0])
        ret = object.put(Body=file,
                        Metadata={'FullName':image[1]})
        
    return JsonResponse(images, safe=False)

def drugs_payed_view(request):
    if request.method == 'POST':
        data = request.POST.get('drugs')
        print(data)
        sqs = boto3.resource('sqs', region_name='us-east-1')
        queue = sqs.get_queue_by_name(QueueName='Orders-queue.fifo')

        message_body = json.dumps(data)
        response = queue.send_message(MessageBody = message_body, MessageGroupId ='orders')

        print(response)

        return JsonResponse({'success': True, 'message': data})

    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

def verify_photo_view(request):
    rekognition = boto3.client('rekognition', region_name='us-east-1')
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')
    if request.method == 'POST':
        # Assuming the file field in the request is named 'photo'
        photo = request.FILES.get('photo')
        print(photo)

        if photo is not None:
            image = Image.open(photo)
            stream = io.BytesIO()
            image.save(stream, format="JPEG")
            image_binary = stream.getvalue()

            response = rekognition.search_faces_by_image(
                CollectionId='famouspersons',
                Image={'Bytes': image_binary}
            )

            found = False
            for match in response['FaceMatches']:
                face_id = match['Face']['FaceId']
                confidence = match['Face']['Confidence']

                face = dynamodb.get_item(
                    TableName='facerecognition',
                    Key={'RekognitionId': {'S': face_id}}
                )

                if 'Item' in face:
                    full_name = face['Item']['FullName']['S']
                    print(f"Found Person: {full_name}, Confidence: {confidence}")
                    found = True

            if not found:
                print("Person cannot be recognized")
                return JsonResponse({'success': False, 'message': 'Not recognized'})
            

            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': 'No photo provided'})

    return JsonResponse({'success': False, 'message': 'Invalid request method'})


def get_task_name(execution_arn):
    sf_client = boto3.client('stepfunctions', region_name='us-east-1')
    try:
        response = sf_client.get_execution_history(
            executionArn=execution_arn,
            reverseOrder=True,
            maxResults=1
        )
        events = response['events']
        task_name = None
        for event in events:
            if 'stateEnteredEventDetails' in event and 'name' in event['stateEnteredEventDetails']:
                print(event)
                task_name = event['stateEnteredEventDetails']['name']
                break
        return task_name
    except Exception as e:
        print(f"Failed to retrieve task name for execution {execution_arn}: {str(e)}")
        return 'Unknown'

def get_on_going_view(request):
    print("Got requested")
    
    sf_client = boto3.client('stepfunctions', region_name='us-east-1')

    # Retrieve the running instances of the state machine
    response = sf_client.list_executions(
        stateMachineArn='arn:aws:states:us-east-1:475813182777:stateMachine:Robo',
        statusFilter='RUNNING'
    )

    # Extract the relevant information from the response
    running_instances = [
        {
            'executionArn': instance['executionArn'],
            'name': instance['name'],
            'startDate': str(instance['startDate']),
            'currentState': None,
            'currentInput': None,
            'operation': None  # Add the eventType field
        }
        for instance in response['executions']
    ]

    # Retrieve the current task information for each running instance
    for instance in running_instances:
        execution_arn = instance['executionArn']
        try:
            execution_response = sf_client.describe_execution(executionArn=execution_arn)
            
            instance['currentState'] = execution_response['status']
            
            # Extracting "body" from "currentInput"
            input_json = json.loads(execution_response['input'])
            instance['currentInput'] = input_json['Records'][0]['body']
            
          
            
            instance['operation'] = get_task_name(execution_arn)
            
           
        except Exception as e:
            print(f"Failed to retrieve task information for execution {execution_arn}: {str(e)}")

    print(running_instances)

    # Return the running instances as a JSON response
    return JsonResponse({'running_instances': running_instances})