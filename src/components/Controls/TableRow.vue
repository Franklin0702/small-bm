<template>
  <Row :ratio="ratio" class="w-full px-2 border-b hover:bg-brand-100 group">
    <div class="flex items-center pl-2 text-gray-600">
      <span v-if="!disable.includes('remove')" class="hidden group-hover:inline-block">
        <feather-icon
          name="x"
          class="w-4 h-4 -ml-1 cursor-pointer"
          :class="{
            'pointer-events-none': disable.includes('remove')
          }"
          @click="$emit('remove')"
        />
      </span>
      <span v-else-if="disable.includes('credit-note-option')">
        <span
          class="cursor-pointer"
          :class="{
            'pointer-events-none': disable.includes('take')
          }"
          @click="$propagatedEmit('Take', row)"
        >
          ->
        </span>
      </span>
      <span v-else>
      <span class="group-hover:hidden">
        {{ row.idx + 1 }}
      </span>
    </div>

    <!-- <div
      class="flex items-center text-gray-600"
      v-if="disable.includes('credit-note-option')"
    >
      <span>
        <span
          class="cursor-pointer"
          :class="{
            'pointer-events-none': disable.includes('take')
          }"
          @click="$propagatedEmit('Take', row)"
        >
          ->
        </span>
      </span>
    </div> -->

    <FormControl
      :size="size"
      class="py-2"
      :class="{
        'pointer-events-none':
          disable.includes(df.fieldname) || disable.includes('fields')
      }"
      :input-class="{ 'text-right': isNumeric(df), 'bg-transparent': true }"
      :key="df.fieldname"
      v-for="df in tableFields"
      :df="df"
      :value="row[df.fieldname]"
      @change="value => row.set(df.fieldname, value)"
      @new-doc="doc => row.set(df.fieldname, doc.name)"
    />
  </Row>
</template>
<script>
import FormControl from './FormControl';
import Row from '@/components/Row';

export default {
  name: 'TableRow',
  props: {
    row: Object,
    tableFields: Array,
    size: Number,
    ratio: Array,
    isNumeric: Function,

  },
  // ['row', 'tableFields', 'size', 'ratio', 'isNumeric', 'disable'],
  components: {
    Row
  },
  data: () => ({ hovering: false, disable: [''] }),
  beforeCreate() {
    this.$options.components.FormControl = FormControl;
  },
  mounted() {
    this.disable =  [...this.$parent.disable];
  },
  computed: {
    getHovering() {
      return this.hovering;
    }

  },
  provide() {
    return {
      doctype: this.row.doctype,
      name: this.row.name,
      doc: this.row
    };
  }
};
</script>
