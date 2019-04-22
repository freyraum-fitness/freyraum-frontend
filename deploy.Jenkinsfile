pipeline {
  agent any
  options {
    skipDefaultCheckout()
  }
  parameters {
    string (
        defaultValue: 'ok',
        description: 'the tag that should be build',
        name : 'TAG'
    )
  }
  environment {
    DOCKER_REGISTRY = "localhost:5000"
    APP_NAME = "freyraum-frontend"
  }
  when(
      expression {
        return ${TAG} != ""
      }
  )
  stages {
    stage('pull image') {
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
