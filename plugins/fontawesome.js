import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faCalculator, 
  faBars, 
  faTools,
  faTimes, 
  faChevronDown, 
  faUserCircle, 
  faSignInAlt, 
  faUserPlus, 
  faCog, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons'

// Thêm các biểu tượng vào library
library.add(
  faCalculator,
  faBars,
  faTools,
  faTimes,
  faChevronDown,
  faUserCircle,
  faSignInAlt,
  faUserPlus,
  faCog,
  faSignOutAlt
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})