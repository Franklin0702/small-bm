<template>
  <div v-if="dbType === 'server'" class="w-full max-w-lg">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          for="dbName"
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >Base de datos:
        </label>
        <input
          type="text"
          id="dbName"
          name="dbName"
          v-model="dbName"
          placeholder="mi_db"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
        <p class="text-red-500 text-xs italic">Favor completar este campo. </p>
      </div>

      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          for="dbHost"
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >Servidor:
        </label>
        <input
          type="text"
          id="dbHost"
          name="dbHost"
          v-model="dbHost"
          placeholder="mi_db"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
        <p class="text-red-500 text-xs italic">Favor completar este campo. </p>
      </div>

      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          for="dbUserName"
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >Usuario:
        </label>
        <input
          type="text"
          id="dbUserName"
          name="dbUserName"
          v-model="dbUserName"
          placeholder="mi_db"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
        <p class="text-red-500 text-xs italic">Favor completar este campo. </p>
      </div>

      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          for="dbUserPassword"
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          >Contraseña:
        </label>
        <input
          type="password"
          id="dbUserPassword"
          name="dbUserPassword"
          v-model="dbUserPassword"
          placeholder="mi_db"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
        />
        <p class="text-red-500 text-xs italic">Favor completar este campo. </p>
      </div>
    </div>
    <br />
    <Button class="text-sm" @click="ConnectDatabase">
      {{ _('Conectarse') }}
    </Button>
    <span v-if="canConnect === false" style="color:red;"
      >No se pudo realizar la conexión.</span
    >
  </div>
</template>

<script>
import config from '@/config';
import Button from '@/components/Button';

import { testMySQLConnection } from '@/utils';

import { remote } from 'electron';
export default {
  components: {
    Button
  },
  data() {
    return {
      dbType: null,
      dbName: null,
      dbUserName: null,
      dbUserPassword: null,
      dbHost: null,
      canConnect: null
    };
  },
  mounted() {
    this.dbType = 'server';
  },
  methods: {
    async ConnectDatabase() {
      this.canConnect = testMySQLConnection({
        dbname: this.dbName,
        user: this.dbUserName,
        password: this.dbUserPassword,
        host: this.dbHost
      });
      if (this.canConnect) {
        let options = {
          db_name: this.dbName,
          host: this.dbHost,
          username: this.dbUserName,
          password: this.dbUserPassword
        };
        config.set('dbType', this.dbType);
        config.set('server-connection', JSON.stringify(options));
        this.$emit('on-connect', options);
      }
    }
  }
};
</script>
