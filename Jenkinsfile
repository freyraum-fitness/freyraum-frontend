
def mapBranchToEnvironment(branch) {
  def appName = 'freyraum-frontend'
  if (branch == 'master') {
    return '[PRODUCTION]'
  }
  if (branch == 'develop') {
    return '[TEST]'
  }
  return '[DEVELOPMENT]'
}

def mapBranchToAppName(branch) {
  def appName = 'freyraum-frontend'
  if (branch == 'master') {
    return appName
  }
  if (branch == 'develop') {
    return appName + '_int'
  }
  return appName + '_tst'
}

def mapBranchToDockerImage(branch) {
  def appName = 'freyraum-frontend'
  if (branch == 'master') {
    return appName + ':latest'
  }
  if (branch == 'develop') {
    return appName + ':next'
  }
  return appName + ':snapshot'
}

def mapBranchToNpm(branch) {
  if (branch == 'master') {
    return 'build_production'
  }
  if (branch == 'develop') {
    return 'build_int'
  }
  return 'build_tst'
}

pipeline {
  agent none
  options {
    skipDefaultCheckout()
  }
  environment{
    ENV_NAME = mapBranchToEnvironment("${BRANCH_NAME}")
    APP_NAME = mapBranchToAppName("${BRANCH_NAME}")
    DOCKER_IMAGE = mapBranchToDockerImage("${BRANCH_NAME}")
    BRANCH = "${BRANCH_NAME}"
    NPM_CMD = mapBranchToNpm("${BRANCH_NAME}")
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
        sh 'npm run ${NPM_CMD}'
      }
    }

    stage('containerize') {
      agent any
      steps {
        sh 'docker build . -f Dockerfile -t ${APP_NAME}'
        sh 'docker tag ${APP_NAME} localhost:5000/${DOCKER_IMAGE}'
        sh 'docker push localhost:5000/${DOCKER_IMAGE}'
      }
    }
  }

  post {
    success {
      slackSend(color: "#BDFFC3", message: "${ENV_NAME} created new docker image successfully: ${DOCKER_IMAGE}")
    }
    failure {
      slackSend(color: "#FF9FA1", message: "${ENV_NAME} (${DOCKER_IMAGE}) build failed - ${env.BRANCH} ${env.BUILD_NUMBER}")
    }
  }
}
