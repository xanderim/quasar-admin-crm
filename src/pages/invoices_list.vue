<template>
  <q-page class="q-pa-sm">
    <q-card>
      <q-table
          title="Invoices"
          :rows="invoices"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination.sync="pagination"
      >
        <template v-slot:top-right="props">
          <q-btn @click="new_invoice=true" outline color="primary" label="Add New" class="q-mr-xs"/>

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
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <b>{{props.row.amount.toFixed(2)}}</b> {{props.row.currency === 'USD' ? '$' : '€'}}
          </q-td>
        </template>
        <template v-slot:body-cell-paid="props">
          <q-td :props="props">
            <q-icon v-if="props.row.paid" name="check" color="teal" size="2em" />
            <q-icon v-if="!props.row.paid" name="close" color="red" size="2em" />
          </q-td>
        </template>
        <template v-slot:body-cell-detail="props">
          <q-td :props="props">
            <q-btn @click="invoice_dialog=true" dense round color="secondary" icon="pageview"/>
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <div class="q-gutter-sm">
              <q-btn @click="invoice_dialog=true" dense color="primary" icon="edit"/>
              <q-btn dense color="red" icon="delete"/>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="new_invoice">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">
            Add new invoice
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Client</q-item-label>
                  <q-input dense outlined v-model="invoice.client" label="Customer Name"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Project</q-item-label>
                  <q-input dense outlined v-model="invoice.project" label="City"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Amount</q-item-label>
                  <q-input dense outlined v-model="invoice.amount" label="State"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Last Call</q-item-label>
                  <q-input
                      dense
                      outlined
                      v-model="invoice.due_date"
                      mask="date"
                      label="Last Call"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                            ref="lastCallProxy"
                            transition-show="scale"
                            transition-hide="scale"
                        >
                          <q-date
                              v-model="invoice.due_date"
                              @input="() => $refs.lastCallProxy.hide()"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn label="Save" type="submit" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="invoice_dialog">
      <q-card class="my-card" flat bordered>
        <q-card-section>
          <div class="text-h6">
            Employee Details
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </div>
        </q-card-section>
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline">US Region</div>
            <div class="text-h5 q-mt-sm q-mb-xs">Mayank Patel</div>
            <div class="text-caption text-grey">
              Sales and Marketing Executive | Graduate and past committee | Keynote speaker on Selling and Recruiting
              Topics
            </div>
          </q-card-section>

          <q-card-section class="col-5 flex flex-center">
            <q-img
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/boy-avatar.png"
            />
          </q-card-section>
        </q-card-section>

        <q-separator/>

        <q-card-section>
          Assessing clients needs and present suitable promoted products. Liaising with and persuading targeted doctors
          to prescribe our products utilizing effective sales skills.
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {exportFile, date} from "quasar";
import {getFirestore, collection, getDocs, orderBy, query} from "firebase/firestore";
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
    const invoices = ref([])
    const db = getFirestore()

    onBeforeMount(async () => {
      const data = []
      const invoicesRef = collection(db, "invoices");
      const querySnapshot = await getDocs(query(invoicesRef, orderBy('date')));
      querySnapshot.forEach((doc) => {
        const invoice = doc.data()
        invoice.date = date.formatDate(invoice.date.toDate(), 'DD.MM.YY')
        invoice.client = invoice.client.id.replace('_', ' ').toUpperCase()
        invoice.project = invoice.project.id.replace('_', ' ').toUpperCase()
        data.push(invoice)
      });
      invoices.value = data
    })

return {
      invoices
}
  },
  data() {
    return {
      filter: "",
      mode: "list",
      invoice: {},
      new_invoice: false,
      invoice_dialog: false,
      columns: [
    {
          name: "client",
          align: "left",
          label: "Client",
          field: "client",
          sortable: true
        },
        {
          name: "project",
          required: true,
          label: "Project",
          align: "left",
          field: "project",
          sortable: true
        },
        {
          name: "date",
          align: "left",
          label: "Date",
          field: "date",
          sortable: true
        },
        {
          name: "amount",
          align: "left",
          label: "Amount",
          field: "amount",
          sortable: true
        },
        {
          name: "paid",
          align: "left",
          label: "Paid",
          field: "paid",
          sortable: true
        },
        {
          name: "action",
          align: "left",
          label: "Action",
          field: "action",
          sortable: true
        }
      ],
      pagination: {
        rowsPerPage: 100
      }
    };
  },
  methods: {
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
      .concat(
          this.invoices.map(row =>
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

      const status = exportFile("employee_salary_list.csv", content, "text/csv");

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
<style>
.q-chip__content {
  display: block;
  text-align: center;
}
</style>
