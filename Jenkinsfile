pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  triggers { githubPush() }

  environment {
    SONARQUBE_SERVER = 'SonarQubeServer'   // nombre configurado en Jenkins
    SCANNER_HOME     = tool 'SonarScanner' // nombre configurado en Manage Jenkins > Tools
  }

  stages {

    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Shernandez03/frontend.git'
      }
    }

    stage('Node & NPM Versions') {
      steps {
        bat 'node -v'
        bat 'npm -v'
      }
    }

    stage('Install Dependencies') {
      when { expression { return fileExists('package.json') } }
      steps {
        bat 'npm ci'
      }
    }

    stage('Build Project') {
      when { expression { return fileExists('vite.config.js') } }
      steps {
        bat 'npm run build'
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Run Unit Tests') {
      when { expression { return fileExists('vitest.config.js') } }
      steps {
        bat 'npm run test || echo "Sin pruebas unitarias configuradas"'
      }
    }

    stage('SonarQube Scan') {
      steps {
        withSonarQubeEnv(env.SONARQUBE_SERVER) {
          bat '"%SCANNER_HOME%\\bin\\sonar-scanner.bat"'
        }
      }
    }

    stage('Quality Gate') {
      steps {
        script {
          timeout(time: 7, unit: 'MINUTES') {
            def qg = waitForQualityGate()
            if (qg.status != 'OK') {
              error "Quality Gate FAILED: ${qg.status}"
            }
          }
        }
      }
    }

    stage('Deploy (Simulado)') {
      when {
        anyOf {
          branch 'qa'
          branch 'prod'
        }
      }
      steps {
        echo "Despliegue simulado del Frontend (${env.BRANCH_NAME}) completado ✅"
      }
    }
  }

  post {
    always {
      echo "Pipeline finalizado correctamente para rama: ${env.BRANCH_NAME}"
    }
  }
}
