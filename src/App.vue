<template>
  <div id="app" class="h-screen flex flex-col font-sans antialiased">
    <WindowsTitleBar
      v-if="platform === 'Windows'"
      @close="reloadMainWindowOnSettingsClose"
    />
    <Desk class="flex-1" v-if="activeScreen === 'Desk'" />

    <DatabaseSelector
      v-if="activeScreen === 'DatabaseSelector'"
      @database-connect="showSetupWizardOrDesk(true)"
    />

    <SetupWizard
      v-if="activeScreen === 'SetupWizard'"
      @setup-complete="showSetupWizardOrDesk(true)"
    />
    <Settings v-if="activeScreen === 'Settings'" />
    <portal-target name="popovers" multiple></portal-target>
  </div>
</template>

<script>
import './styles/index.css';
import 'frappe-charts/dist/frappe-charts.min.css';
import frappe from 'frappejs';
import Desk from './pages/Desk';
import SetupWizard from './pages/SetupWizard/SetupWizard';
import DatabaseSelector from './pages/DatabaseSelector';
import Settings from '@/pages/Settings/Settings.vue';
import RemoteDatabase from '@/pages/RemoteDatabase/RemoteDatabase.vue';
import WindowsTitleBar from '@/components/WindowsTitleBar';
import { remote } from 'electron';
import config from '@/config';
import { connectToLocalDatabase, connectToDatabaseServer } from '@/utils';
import { getMainWindowSize } from '@/screenSize';

export default {
  name: 'App',
  data() {
    return {
      activeScreen: null
    };
  },
  watch: {
    activeScreen(value) {
      if (!value) return;
      let { width, height } = getMainWindowSize();
      let size = {
        Desk: [width, height],
        DatabaseSelector: [600, 600],
        SetupWizard: [600, 600],
        Settings: [460, 577],
        RemoteDatabase: [460, 577]
      }[value];
      let resizable = value === 'Desk';

      let win = remote.getCurrentWindow();
      if (size.length) {
        win.setSize(...size);
        win.setResizable(resizable);
      }
    }
  },
  components: {
    Desk,
    SetupWizard,
    DatabaseSelector,
    Settings,
    WindowsTitleBar,
    RemoteDatabase
  },
  async mounted() {
    let dbType = config.get('dbType', null);
    console.log('App dbType: ', dbType);
    if (!dbType) {
      this.activeScreen = 'DatabaseSelector';
    } else {
      if (dbType === 'local') {
        let lastSelectedFilePath = config.get('lastSelectedFilePath', null);
        await connectToLocalDatabase(lastSelectedFilePath);
      } else {
        let options = config.get('server-connection', null);
        console.log('App server-connection: ', options);

        options = options ? JSON.parse(options) : null;
        try {
          await connectToDatabaseServer({
            db_name: options.db_name, 
            username: options.username,
            password: options.password,
            host: options.host
          });
        } catch (err) {
          console.log('can\'t connect', err);
          this.activeScreen = 'Settings';
        }
      }

      this.showSetupWizardOrDesk();
    }
  },
  methods: {
    showSetupWizardOrDesk(resetRoute = false) {
      const { setupComplete } = frappe.AccountingSettings;
      if (!setupComplete) {
        this.activeScreen = 'SetupWizard';
      } else if (this.$route.path.startsWith('/settings')) {
        this.activeScreen = 'Settings';
      } else {
        this.activeScreen = 'Desk';
        this.checkForUpdates();
      }
      if (resetRoute) {
        this.$router.replace('/');
      }
    },
    reloadMainWindowOnSettingsClose() {
      if (this.activeScreen === 'Settings') {
        frappe.events.trigger('reload-main-window');
      }
    },
    checkForUpdates() {
      console.log('CHECKING UPDATES!!!!!!');
      frappe.events.trigger('check-for-updates');
    }
  }
};
</script>
