pipeline {
  agent any
  options {
    skipDefaultCheckout()
  }
  environment {
    DOCKER_REGISTRY = "localhost:5000"
    APP_NAME = "freyraum-frontend"
  }
  stages {
    stage('pull :ok') {
      steps { sh 'docker pull ${DOCKER_REGISTRY}/${APP_NAME}:ok' }
    }
    stage('stop app') {
      steps { sh 'docker stop ${APP_NAME} || true' }
    }
    stage('remove app') {
      steps { sh 'docker rm ${APP_NAME} || true' }
    }
    stage('run app') {
      steps {
        sh '''
          docker run -d \
            -p 30050:4000 \
            --restart=always \
            --name ${APP_NAME} \
            ${DOCKER_REGISTRY}/${APP_NAME}:ok
        '''
      }
    }

  }
  post {
    success {
      slackSend(color: "#BDFFC3", message: "${APP_NAME}:latest started")
    }
    failure {
      slackSend(color: "#FF9FA1", message: "${APP_NAME} - failed to update - app down!")
    }
  }

}
