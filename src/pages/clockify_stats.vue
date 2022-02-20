<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
          :title="`Clockify Stats for ${new Date().toLocaleString('default', { month: 'long' }) }`"
          :rows="devs"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <q-btn @click="new_customer=true" outline color="primary" label="Add New" class="q-mr-xs"/>

          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>

          <q-btn
              flat
              round
              dense
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="props.toggleFullscreen"
              v-if="mode === 'list'"
          >
            <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
            >{{ props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen' }}
            </q-tooltip>
          </q-btn>

          <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'"
              v-if="!props.inFullscreen"
          >
            <q-tooltip
                :disable="$q.platform.is.mobile"
                v-close-popup
            >{{ mode === 'grid' ? 'List' : 'Grid' }}
            </q-tooltip>
          </q-btn>

          <q-btn
              color="primary"
              icon-right="archive"
              label="Export to csv"
              no-caps
              @click="exportTable"
          />
        </template>

        <template v-slot:body-cell-clockify_time="props">
          <q-td :props="props">
            <b v-if="props.row.earnings">{{$filters.convertSecondsToHms(props.row.clockify_time)}}</b>
            <b v-if="!props.row.earnings">{{props.row.earnings}}</b>
          </q-td>
        </template>

        <template v-slot:body-cell-earnings="props">
          <q-td :props="props">
            <b v-if="props.row.earnings">{{props.row.earnings.toFixed(2)}} $</b>
            <b v-if="!props.row.earnings">{{props.row.earnings}}</b>
          </q-td>
        </template>

      </q-table>
    </q-card>

  </q-page>
</template>

<script>
import {exportFile} from "quasar";
import {Balance} from "src/services/balance";
import {onBeforeMount, ref} from "vue";

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
      formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  setup() {
    const devs = ref([])

    onBeforeMount(async () => {
      devs.value = await Balance.getDevsIncome()
    })

    return {
      devs
    }
  },
  data() {
    // name, salary.amount, clockify_time, earnings
    return {
      filter: "",

      mode: "list",
      columns: [
        {
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: "name",
          sortable: true
        },
        {
          name: "salary",
          align: "left",
          label: "Salary / rate",
          field: row => {
            if (row.rate) {
              return `${row.salary.amount} / ${row.rate}$`
            }
            return `${row.salary.amount} $`
          },
          sortable: true
        },
        {
          name: "clockify_time",
          align: "left",
          label: "Clockify, hours",
          field: "clockify_time",
          sortable: true
        },
        {
          name: "earnings",
          align: "left",
          label: "Earnings",
          field: "earnings",
          sortable: true
        }
      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  methods: {
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
      .concat(
          this.data.map(row =>
              this.columns
              .map(col =>
                  wrapCsvValue(
                      typeof col.field === "function"
                          ? col.field(row)
                          : row[col.field === void 0 ? col.name : col.field],
                      col.format
                  )
              )
              .join(",")
          )
      )
      .join("\r\n");

      const status = exportFile("customer-management.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  }
};
</script>
