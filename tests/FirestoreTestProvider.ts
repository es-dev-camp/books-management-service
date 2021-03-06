import * as firebase from '@firebase/testing';
import * as fs from 'fs';

export default class FirestoreTestProvider {
  private testNumber = 0;
  private projectName: string;
  private rules: string;

  constructor(projectName: string, rulesFilePath = 'firestore.rules') {
    this.projectName = projectName + '-' + Date.now();
    this.rules = fs.readFileSync(rulesFilePath, 'utf8');
  }

  increment() {
    this.testNumber++;
  }

  private getProjectID() {
    return `${this.projectName}-${this.testNumber}`;
  }

  loadRules() {
    return firebase.loadFirestoreRules({
      projectId: this.getProjectID(),
      rules: this.rules
    });
  }
  getFirestoreWithAuth(auth?: { [key in 'uid' | 'email']?: string }) {
    return firebase
      .initializeTestApp({
        projectId: this.getProjectID(),
        auth: auth
      })
      .firestore();
  }

  getAdminFirestore() {
    return firebase
      .initializeAdminApp({ projectId: this.getProjectID() })
      .firestore();
  }

  cleanup() {
    return Promise.all(firebase.apps().map((app: any) => app.delete()));
  }
}
