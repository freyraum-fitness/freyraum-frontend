pipeline {
  agent any
  options {
    skipDefaultCheckout()
    timeout(time: 5, unit: 'MINUTES')
  }

  environment {
    APP_NAME = 'freyraum-frontend'
    DOCKER_REGISTRY = 'localhost:5000'
  }

  stages {
    stage('pull image') {
      input {
        message "Confirm update"
        ok "update container"
      }
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
            -p 80 \
            --restart=always \
            --name ${APP_NAME} \
            --network=freyraum \
            ${DOCKER_REGISTRY}/${APP_NAME}:ok
        '''
      }
    }

  }

  post {
    success {
      slackSend(
          color: "#BDFFC3",
          message: "${APP_NAME} started"
      )
    }
    failure {
      slackSend(
          color: "#FF9FA1",
          message: "${APP_NAME} - failed to update - app down!"
      )
    }
  }

}
