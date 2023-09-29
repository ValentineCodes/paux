import axios from "axios";

class TransactionsAPI {
    async getTransactions(domain: string, apiKey: string, address: string, page: number) {
        const endpoint = `${domain}/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${apiKey}`

        const {data: transactions} = await axios.get(endpoint)

        return transactions
    }
}

export default new TransactionsAPI