<template>
  <v-container class="fill-height">
    <v-responsive class="d-flex align-top text-center fill-height">
      <v-form @submit.prevent>
        <v-row v-for="field in fields" :key="field.key">
          <v-col cols="12">
            <template v-if="field.type=='checkbox'">
              <v-switch
                :id="field.key"
                :name="field.key"
                v-model="form[field.key]"
                :label="field.label"
                color="primary"
              />
            </template>
            <template v-else-if="field.type=='text'">
              <v-text-field
                :type="field.type"
                :id="field.key"
                :name="field.key"
                v-model="form[field.key]"
                :label="field.label"
                :minlength="field.info.minLength"
                :maxlength="field.info.maxLength"
                color="primary"
                :required="field.info.required"
                counter
                clearable
              />
            </template>

            <template v-else-if="field.type=='date'">
              <v-text-field
                type="date"
                :label="field.label"
                :id="field.key"
                :name="field.key"
                v-model="form[field.key]"
                :min="field.info.minimum()"
                :max="field.info.maximum()"
                color="primary"
                :required="field.info.required"
                counter
              />
            </template>
            <template v-else-if="field.type=='email'">
              <v-text-field
                type="email"
                :id="field.key"
                :name="field.key"
                v-model="form[field.key]"
                :label="field.label"
                :minlength="field.info.minLength"
                :maxlength="field.info.maxLength"
                color="primary"
                :required="field.info.required"
                counter
              />
            </template>
            <template v-else-if="field.type=='number'">
              <v-text-field
                type="number"
                :label="field.label"
                :id="field.key"
                :name="field.key"
                :min="field.info.minimum()"
                :max="field.info.maximum()"
                v-model="form[field.key]"
                color="primary"
              />
            </template>
            <template v-else>
              <v-alert border="start" border-color="warning">
                type:{{ field.type }} is not implemented ! Was found in key:{{ field.key }}, label:{{ field.label }}
              </v-alert>
            </template>
          </v-col>
        </v-row>


        <v-btn color="success" class="mr-4" @click="saveFormData"> Save</v-btn>
        <v-btn color="error" class="mr-4" @click=""> Reset Form</v-btn>
      </v-form>
      <div class="row">
        <div class="twelve columns u-full-width">
          <textarea rows="20" class="u-full-width">{{getFormData}}</textarea>
        </div>
      </div>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, SetupContext} from 'vue';
import {baseField, basicTypes, FBoolean, fieldInfo, FInteger, iField, integerValidFormatValues} from './FormSchema';
import {fi} from "vuetify/locale";

interface Field {
  key: string;
  label: string;
  type: string;
  info: baseField;
}


export default defineComponent({
  name: 'DynamicForm',
  computed: {
    fi() {
      return fi
    }
  },
  props: {
    schema: {
      type: Object as () => Record<string, baseField>,
      required: true,
    },
  },
  setup(props: { schema: Record<string, iField> }, ctx: SetupContext) {
    const form = ref({} as Record<string, unknown>);

    onMounted(() => {
      console.log("# DynamicForm Mounted ");
      /*
      const myIntField = new FInteger('myIntField', 'Age',
        true, false, 100, 'your age',
        integerValidFormatValues.int32, {minimum: 0, maximum: 101}
      )
      const myBoolField = new FBoolean('myBoolField', 'Active',
        true, false, true, 'Is it active?'
      )
      console.log(`# myIntField.dump: ${myIntField.dump()}`);
      const arrFields: baseField[] = [myIntField, myBoolField];
      console.log(`# arrFields: ${arrFields.length}`, arrFields);
      */
    })

    // ####### computed props
    const getFormData = computed((): string => {
      console.log(`IN COMPUTED getFormData form: (${form.value})`);
      return JSON.stringify(form.value, null, 2)
    })
    const fields = computed((): Field[] => {
      console.log(`IN COMPUTED fields `);
      const tempFields: Field[] = [];
      for (const [key, value] of Object.entries(props.schema)) {
        let currentFieldInfo: baseField = value as baseField
        const currentInputType = getInputType(baseField);
        console.log(`key: ${key}, type:${currentFieldInfo.type},  currentInputType:${currentInputType}`)
        tempFields.push({
          key,
          label: (value as { title?: string }).title || key,
          type: currentInputType,
          info: currentFieldInfo
        });
      }
      return tempFields;
    }) // end of computed fields()

    // ####### methods
    const getInputType = (fieldInformation: baseField) => {
      let inputType = fieldInformation.type;
      switch (inputType) {
        case basicTypes.boolean:
          return "checkbox";
        case basicTypes.integer:
        case basicTypes.number:
          return "number";
        case basicTypes.string:
          switch (fieldInformation.type !== basicTypes.boolean ? fieldInformation.format : "") {
            case "email":
              return "email";
            case "date":
            case "datetime":
              return "date";
            case "time":
              return "time";
            default:
              return "text";
          }
      }
      return "text"
    }
    const getMinLength = (info: fieldInfo): number => {
      if (info.type == basicTypes.string) {
        if (info.minLength !== undefined) return info.minLength
      }
      return 0
    }
    const getMaxLength = (info: fieldInfo): number => {
      if (info.type == basicTypes.string) {
        if (info.maxLength !== undefined) return info.maxLength
      }
      return 1000
    }
    const saveFormData = (): void => {
      console.log('IN saveFormData');
      ctx.emit('saveFormData', Object.assign({}, form.value));
    };
    return {form, getFormData, fields, getMinLength, getMaxLength, saveFormData}
  } // end of setup
});
</script>

