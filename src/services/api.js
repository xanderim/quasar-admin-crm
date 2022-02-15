import {collection, getDocs, getFirestore} from "firebase/firestore";
import {date} from 'quasar'


class APIService {
  db

  data = {
    projects: [],
    developers: [],
    expenses: [],
    clients: []
  }

  summaryReports = {}

  constructor() {
    this.db = getFirestore()
  }

  async getSnapshot(collectionName) {
    const ref = collection(this.db, collectionName)
    return await getDocs(ref);
  }

  async getAll(collectionName) {
    const data = this.data[collectionName] || []
    if (!data.length) {
      const querySnapshot = await this.getSnapshot(collectionName);
      querySnapshot.forEach((doc) => {
        data.push(doc.data())
      });
    }
    return data
  }

  async getProjects() {
    const projectsData = this.data.projects

    if (!projectsData.length) {
      const querySnapshot = await this.getSnapshot('projects')
      querySnapshot.forEach((doc) => {
        const project = doc.data()
        project.id = doc.id
        project.client = project.client.id.replace('_', ' ').toUpperCase()
        projectsData.push(project)
      });
    }
    return projectsData
  }

  async getDevelopers() {
    return await this.getAll('developers')
  }

  async getExpenses() {
    return await this.getAll('expenses')
  }

  async getClients() {
    return await this.getAll('clients')
  }

  async getSummaryReport(workspaceId) {
    if (!this.summaryReports.hasOwnProperty(workspaceId)) {
      const url = `https://reports.api.clockify.me/v1/workspaces/${workspaceId}/reports/summary`
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': process.env.CLOCKIFY_API,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          "dateRangeStart": date.startOfDate(new Date(), 'month'),
          "dateRangeEnd": date.endOfDate(new Date(), 'month'),
          "summaryFilter": {
            "groups": [
              "USER",
              "PROJECT",
            ],
          },
          "amountShown": "HIDE_AMOUNT",
        }),
      })
      this.summaryReports[workspaceId] = response.json()
    }

    return this.summaryReports[workspaceId]
  }

  async getHours() {

  }
}

export const API = new APIService()
