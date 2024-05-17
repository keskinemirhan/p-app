pipeline {
  agent any
  environment {
    SECRET_FILE_NEST = credentials("p-app-backend-env")
  }
  tools {
    nodejs "NodeJS"
  }
  stages {
    stage("Environment Setup") {
      steps {
        dir("backend") {
          script {
            withCredentials([file(credentialsId: "p-app-backend-env", variable: "SECRET_FILE_NEST")]) {
              writeFile file: ".env", text: readFile(file: "${SECRET_FILE_NEST}")
            }
          }
        }
      }
    }
    stage("Build and Run") {
      steps {
        "run nest" : {
          dir("backend") {
            bat "npm install"
            bat "npm start"
          }
        }
        
      }
    }
  }
}
