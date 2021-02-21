<template>
  <div>
    <form method="post" :action="addRoute" autocomplete="off">
      <div class="form-group">
        <label for="url">Product Link</label>
        <input class="form-control" name="url" type="url">
      </div>
      <div class="form-group">
        <label for="price">Desired Price</label>
        <input class="form-control" name="price" type="number" step=".01">
      </div>
      <div class="form-group">
        <label for="email">Email address</label>
        <input class="form-control" name="email" type="email">
      </div>
      <button class="btn btn-primary" type="submit" value="Submit">Submit</button>
    </form>
  </div>
</template>

<script>
import projectSettings from '../../../project-settings'

export default {
  data() {
    return {
      addRoute: 'http://' + projectSettings.ip + ':' + projectSettings.port + '/add'
    }
  }
}
</script>
