<template>
  <div id="app">
    <Header/>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-9 order-1 order-md-0">
          <Delete/>
          <div class="mb-3"></div>
          <List/>
        </div>
        <div class="col-12 col-md-3 order-0 order-md-1">
          <Request/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import List from './components/List'
import Request from './components/Request'
import Delete from './components/Delete'

export default {
  name: 'App',
  components: {
    Header,
    List,
    Request,
    Delete
  }
}
</script>
