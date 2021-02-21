<template>
  <div class="mt-2">
    <form method="post" :action="deleteRoute" autocomplete="off">
      <div class="form-group">
        <label for="index">Index</label>
        <input class="form-control" name="index" type="number">
      </div>
      <button class="btn btn-danger" type="submit" value="Submit">Delete</button>
    </form>
  </div>
</template>

<script>
import projectSettings from '../../../project-settings'

export default {
  data() {
    return {
      deleteRoute: 'http://' + projectSettings.ip + ':' + projectSettings.port + '/delete'
    }
  }
}
</script>