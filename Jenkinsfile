pipeline {
    agent any

    environment {
        NODE_VERSION = '20'
        CI = 'true'
    }

    options {
        // Keep only last 10 builds to save disk space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Fail the build if it runs longer than 20 minutes
        timeout(time: 20, unit: 'MINUTES')
        // Add timestamps to console output
        timestamps()
    }

    stages {

        // ─────────────────────────────────────────────────────────────────
        // Stage 1: Checkout
        // Jenkins clones the repo automatically via SCM, this stage just
        // prints what commit we're building for traceability.
        // ─────────────────────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo "Building branch: ${env.BRANCH_NAME ?: 'local'}"
                echo "Commit: ${env.GIT_COMMIT ?: 'N/A'}"
                sh 'node --version'
                sh 'npm --version'
            }
        }

        // ─────────────────────────────────────────────────────────────────
        // Stage 2: Install Dependencies
        // Uses `npm ci` (clean install) for reproducible, fast installs.
        // ─────────────────────────────────────────────────────────────────
        stage('Install Dependencies') {
            parallel {
                stage('Install Server') {
                    steps {
                        dir('server') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Install Client') {
                    steps {
                        dir('client') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────
        // Stage 3: Run Tests
        // Runs server unit tests using Vitest in CI mode (NODE_ENV=test).
        // Real DB credentials are NOT needed for unit tests.
        // ─────────────────────────────────────────────────────────────────
        stage('Test') {
            steps {
                dir('server') {
                    sh 'cp .env.test .env.local 2>/dev/null || true'
                    withEnv([
                        'NODE_ENV=test',
                        'PORT=4000',
                        'BETTER_AUTH_SECRET=ci-test-secret',
                        'BETTER_AUTH_URL=http://localhost:4000'
                    ]) {
                        sh 'npm run test:run'
                    }
                }
            }
            post {
                always {
                    echo 'Test stage complete.'
                }
                failure {
                    echo '❌ Tests failed — aborting pipeline.'
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────
        // Stage 4: Build Client
        // Runs TypeScript compiler check + Vite production build.
        // Output is placed in client/dist/
        // ─────────────────────────────────────────────────────────────────
        stage('Build Client') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
            post {
                success {
                    echo '✅ Client built successfully.'
                    // Archive the dist folder as a Jenkins build artifact
                    archiveArtifacts artifacts: 'client/dist/**/*', fingerprint: true
                }
            }
        }

        // ─────────────────────────────────────────────────────────────────
        // Stage 5: Deploy
        // Currently archives the build artifact. Update this stage with
        // your actual deployment commands once you have a target server.
        //
        // Examples you can swap in:
        //   - SCP to VPS:  sh 'scp -r client/dist user@yourserver:/var/www/html'
        //   - Render:      sh 'curl -X POST $RENDER_DEPLOY_HOOK_URL'
        //   - Vercel CLI:  sh 'npx vercel --prod --token=$VERCEL_TOKEN'
        // ─────────────────────────────────────────────────────────────────
        stage('Deploy') {
            when {
                // Only deploy from the main branch
                branch 'main'
            }
            steps {
                echo '🚀 Deploy stage — update this with your deployment commands.'
                echo 'Build artifacts are archived and ready.'
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────
    // Post-build notifications
    // ─────────────────────────────────────────────────────────────────────
    post {
        success {
            echo "✅ Pipeline succeeded for ${env.BRANCH_NAME ?: 'local'} — commit ${env.GIT_COMMIT ?: 'N/A'}"
        }
        failure {
            echo "❌ Pipeline FAILED for ${env.BRANCH_NAME ?: 'local'} — check the logs above."
        }
        always {
            // Clean workspace to free disk space after each build
            cleanWs()
        }
    }
}
