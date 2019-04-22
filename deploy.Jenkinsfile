pipeline {
  agent any
  options {
    skipDefaultCheckout()
    timeout(time: 5, unit: 'MINUTES')
  }
  environment {
    DOCKER_REGISTRY = "localhost:5000"
    APP_NAME = "freyraum-frontend"
  }
  stages {
    stage('pull image') {
      input {
        message "Choose a tag"
        ok "update container"
        parameters {
          choice(name: 'TAG', choices: ['ok'], description: 'docker image tag')
        }
      }
      steps { sh 'docker pull ${DOCKER_REGISTRY}/${APP_NAME}:${TAG}' }
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
            -p 3333:4000 \
            --restart=always \
            --name ${APP_NAME} \
            ${DOCKER_REGISTRY}/${APP_NAME}:${TAG}
        '''
      }
    }

  }
  post {
    success {
      slackSend(color: "#BDFFC3", message: "${APP_NAME}:${TAG} started")
    }
    failure {
      slackSend(color: "#FF9FA1", message: "${APP_NAME}:${TAG} - failed to update - app down!")
    }
  }

}
