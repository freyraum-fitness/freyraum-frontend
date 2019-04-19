
pipeline {
  agent any
  options {
    skipDefaultCheckout()
  }
  environment{
    DOCKER_REGISTRY = "localhost:5000"
    APP_NAME = "freyraum-frontend"
    RC_TAG = "rc"
    OK_TAG = "ok"
  }
  stages {
    stage('checkout') {
      steps { checkout scm }
    }

    stage('npm install') {
      steps { sh 'npm install' }
    }

    stage('npm test') {
      steps { sh 'npm test' }
    }

    stage('npm build production') {
      steps { sh 'npm run build' }
    }

    stage('build rc container') {
      steps {
        sh 'docker build . -f Dockerfile -t ${APP_NAME}'
        sh 'docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${RC_TAG}'
      }
    }

    stage('tag image as ok') {
      steps {
        sh 'docker tag ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${RC_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:${OK_TAG}
      }
    }
  }

  post {
      success {
        slackSend(
          color: "#BDFFC3",
          message: "${APP_NAME}:${OK_TAG} docker container build"
        )
      }
      failure {
        slackSend(
          color: "#FF9FA1",
          message: "${APP_NAME} build failed - ${env.BRANCH} ${env.BUILD_NUMBER}"
        )
      }
    }
}
