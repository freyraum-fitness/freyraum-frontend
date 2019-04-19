
pipeline {
  agent none
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
      agent any
      steps {
        checkout scm
      }
    }

    stage('npm install') {
      agent {
        docker { image 'node:9-alpine' }
      }
      steps {
        sh 'npm install'
      }
    }

    stage('npm test') {
      agent {
        docker { image 'node:9-alpine' }
      }
      steps {
        sh 'npm test'
      }
    }

    stage('npm build production') {
      agent {
        docker { image 'node:9-alpine' }
      }
      steps {
        sh 'npm run build'
      }
    }

    stage('build rc container') {
      agent any
      steps {
        sh 'docker build . -f Dockerfile -t ${APP_NAME}'
        sh 'docker tag ${APP_NAME} ${DOCKER_REGISTRY}/${APP_NAME}:${RC_TAG}'
        sh 'docker push ${DOCKER_REGISTRY}/${APP_NAME}:${RC_TAG}'
      }
    }

    stage('tag image as ok') {
      agent any
      steps {
        sh 'docker tag ${DOCKER_REGISTRY}/${APP_NAME}:${RC_TAG} ${DOCKER_REGISTRY}/${APP_NAME}:${OK_TAG}'
        sh 'docker push ${DOCKER_REGISTRY}/${APP_NAME}:${OK_TAG}'
      }
    }
  }

  post {
      success {
        slackSend(
          color: "#BDFFC3",
          message: "${APP_NAME} - tagged container as ${OK_TAG}"
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
