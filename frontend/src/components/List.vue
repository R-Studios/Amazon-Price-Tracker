<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Product</th>
          <th scope="col">Desired Price</th>
          <th scope="col">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(request, index) in requests" :key="index" style ="word-break:break-all">
          <td style="width: 5%">
            {{index}}
          </td>
          <td style="width: 60%">
            {{request.url}}
          </td>
          <td style="width: 15%">
            {{request.price + currency}}
          </td>
          <td style="width: 20%">
            {{request.email}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
import projectSettings from '../../../project-settings'

export default {
  data() {
    return {
      requests: {},
      currency: projectSettings.currency
    }
  },
  mounted() {
    axios.get('http://' + projectSettings.ip + ':' + projectSettings.port + '/')
      .then((response) => {
      console.log(response.data)
      this.requests = response.data
    })
    .catch((error) => {
      console.log(error)
    })
  }
}
</script>
