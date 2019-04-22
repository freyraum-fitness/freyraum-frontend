pipeline {
  agent any
  options {
    skipDefaultCheckout()
    timeout(time: 5, unit: 'MINUTES')
  }
  parameters {
    choice(name: 'TAG', choices: ['ok', 'rc'], description: 'docker image tag')
    string(name: 'APP_NAME', defaultValue: 'freyraum-frontend', description: 'container name')
    string(name: 'APP_PORT', defaultValue: '3333', description: 'container port')
  }
  environment {
    DOCKER_REGISTRY = "localhost:5000"
    DB_URL = "jdbc:postgresql://93.90.205.170/freyraum-news"
    DB = credentials('db')
  }
  stages {
    stage('pull image') {
      input {
        message "Confirm update"
        ok "update container"
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
            -p ${APP_PORT}:4000 \
            --restart=always \
            --name ${APP_NAME} \
            -e DB_URL=${DB_URL} \
            -e DB_USR=${DB_USR} \
            -e DB_PSW=${DB_PSW} \
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
