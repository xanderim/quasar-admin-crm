import {API} from "src/services/api";

export default class BalanceService {
  totalTimeSeconds = 0
  totalEarnings = 0
  devsIncome = {}

  async totalIncome() {
    if (!this.totalTimeSeconds) {
      try {
        const projects = await API.getProjects()
        const devs = await API.getDevelopers()

        for (const project of projects) {
          const projectReport = await API.getSummaryReport(project.clockify_workspace_id)

          for (const dev of projectReport.groupOne) {
            const devFound = devs.find(d => d.clockify_id === dev._id)

            if (devFound) {
              this.totalTimeSeconds += dev.duration
              devFound.clockify_time = dev.duration
              const projectRate = devFound.projects.find(p => p.ref.id === project.id).rate
              devFound.earnings = dev.duration / 3600 * projectRate
              this.totalEarnings += devFound.earnings
            }
          }
        }
        this.devsIncome = devs
      } catch (e) {
        console.log(e)
      }
    }
    return this.totalTimeSeconds
  }

  async totalExpense() {
    const devs = await API.getDevelopers()
    const expenses = await API.getExpenses()
    const salaryExpenses = devs.reduce((a, b) => +a + +b.salary.amount, 0)

    let otherExpenses = 0
    expenses.forEach(o => {
      if (o.hasOwnProperty('items') && o.date.toDate().getMonth() === new Date().getMonth()) {
        o.items.forEach(item => otherExpenses += item.price)
      }
    })
    return salaryExpenses + otherExpenses
  }
}

export const Balance = new BalanceService()
