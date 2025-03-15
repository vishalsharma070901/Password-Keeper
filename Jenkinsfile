pipeline{
    agent { label 'docker-agent' }
    stages{
        stage("Checkout Code"){
            steps{
               git branch: 'main', credentialsId: '8b206e77-4dac-4354-94e9-f3256f99e348', url: 'https://github.com/Rohit-kr-17/PasswordManager.git'
               
            }
        }
        stage("Log hello"){
            steps{
                echo "Hello World"
            }
        }
    }
}
