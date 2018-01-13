import nav from './nav-config'
import auth from './auth'

const loginSuccess = (to, from, next) => {
  if (auth.loggedIn()) {
    next({
      path: '/'
    })
  } else {
    next()
  }
}
const getComponent = name => require(`./views/${name}.vue`)

const routers = [
  { path: '/', component: require('./views/index') },
  { path: '/login', name: 'login', component: require('./views/login') }
]

nav.forEach((mod) => {
  const subMenus = mod.children
  subMenus.forEach((subMenu) => {
    var component = require('./views'+ subMenu.path + '.vue')
    routers.push({
      path: subMenu.path,
      name: subMenu.name,
      component: component
    })
  })
})

routers.push({
  name: '/courseTable/addDetail',
  path: '/courseTable/addDetail/term/:termId/teacher/:teacherId',
  component: require('./views/courseTable/addDetail.vue')
});
routers.push({
  name: 'courseTableViewItems',
  path: '/courseTable/viewItems',
  component: require('./views/courseTable/viewItems.vue')
});

routers.push({
  path: '*',
  name: 'notfound',
  component: require('./views/notfound')
})

export default routers
