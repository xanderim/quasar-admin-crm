<template>
  <q-page>
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section :class="$q.dark.isActive?'blue_dark':'bg-blue-8'" class="text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">Sales</div>
                <div class="text-h5">160</div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="trending_up"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section :class="$q.dark.isActive?'green_dark':'bg-green-8'" class="text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">Goals</div>
                <div class="text-h5">140</div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="far fa-dot-circle"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section :class="$q.dark.isActive?'orange_dark':'bg-orange-9'" class="text-white">
            <div class="row">
              <div class="col-10">
                <div class="text-h6">% Change</div>
                <div class="text-h5">
                  <q-icon name="arrow_downward"/>
                  2%
                </div>
              </div>
              <div class="col-2">
                <q-icon size="62px" name="compare_arrows"/>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div>
      <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <q-card flat bordered class="">
            <q-card-section class="row">
              <div class="text-h6 col-12">Sales vs Goals
                <q-btn flat dense icon="fas fa-download" class="float-right" @click="SaveImage('bar')"
                       :color="!$q.dark.isActive? 'grey-8':'white'">
                  <q-tooltip>Download</q-tooltip>
                </q-btn>
              </div>
            </q-card-section>

            <q-separator inset></q-separator>

            <q-card-section>
              <v-chart :option="option" ref="bar" :resizable="true" style="height:220px"/>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">

          <q-card flat bordered class="">
            <q-card-section class="row">
              <div class="text-h6 col-12">Market Share & Growth
                <q-btn flat dense icon="fas fa-download" class="float-right" @click="SaveImage('line')"
                       :color="!$q.dark.isActive? 'grey-8':'white'">
                  <q-tooltip>Download</q-tooltip>
                </q-btn>
              </div>
            </q-card-section>

            <q-separator inset></q-separator>

            <q-card-section>
<!--              <v-chart ref="line" :option="lineChartOption" :resizable="true" style="height:220px"/>-->
            </q-card-section>
          </q-card>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">

          <q-card flat bordered class="">
            <q-card-section class="row">
              <div class="text-h6 col-12">Sales vs Quota
                <q-btn flat dense icon="fas fa-download" class="float-right" @click="SaveImage('gauge')"
                       :color="!$q.dark.isActive? 'grey-8':'white'">
                  <q-tooltip>Download</q-tooltip>
                </q-btn>
              </div>

            </q-card-section>

            <q-separator inset></q-separator>

            <q-card-section>
<!--              <v-chart :option="gaugeOptions" ref="gauge" :resizable="true" style="height:220px"/>-->
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section>
            <div class="text-h6">Key Competitors
              <q-btn flat dense icon="fas fa-download" class="float-right" @click="SaveImage('pie')"
                     :color="!$q.dark.isActive? 'grey-8':'white'">
                <q-tooltip>Download</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section>
<!--            <v-chart ref="pie" :option="pieOptions" :resizable="true" style="height:270px"/>-->
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <q-card flat bordered class="">
          <q-card-section>
            <div class="text-h6">Sales Pipeline by Sales Rep
              <q-btn flat dense icon="fas fa-download" class="float-right" @click="SaveImage('stack_bar')"
                     :color="!$q.dark.isActive? 'grey-8':'white'">
                <q-tooltip>Download</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <q-separator inset></q-separator>

          <q-card-section>
<!--            <v-chart ref="stack_bar" :option="stackedBarOptions" :resizable="true" style="height:270px"/>-->
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-col-gutter-sm q-ma-xs">
      <div class="col-12">
        <q-card flat bordered class="bg-white">
          <q-table
            title="All Activities"
            :rows="data"
            :hide-header="mode === 'grid'"
            :columns="columns"
            row-key="name"
            :grid="mode==='grid'"
            :filter="filter"
            :pagination.sync="pagination"
            :class="$q.dark.isActive?'text-white':'text-grey-8'"
          >
            <template v-slot:top-right="props">
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
                >{{props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}}
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
                >{{mode==='grid' ? 'List' : 'Grid'}}
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
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'

    import {exportFile} from 'quasar';
    import { use } from "echarts/core";
    import { CanvasRenderer } from "echarts/renderers";
    import { PieChart, BarChart, LineChart,} from "echarts/charts";
    import {
      TitleComponent,
      TooltipComponent,
      LegendComponent,
        GridComponent,
    } from "echarts/components";
    import { ref } from "vue";
import ECharts from "vue-echarts";
    use([
      CanvasRenderer,
      PieChart,
      BarChart,
      LineChart,
      TitleComponent,
      TooltipComponent,
      LegendComponent,
        GridComponent
    ]);


    function wrapCsvValue(val, formatFn) {
        let formatted = formatFn !== void 0
            ? formatFn(val)
            : val

        formatted = formatted === void 0 || formatted === null
            ? ''
            : String(formatted)

        formatted = formatted.split('"').join('""')

        return `"${formatted}"`
    }

    export default {
      components: {'v-chart': ECharts},
      setup () {
        const $q = useQuasar()


        const option = ref({
          grid: {
            bottom: '20%',
            left: '15%',
            top: '3%'
          },
          legend: {
            bottom: 0,
            textStyle: {
              color: $q.dark.isActive ? 'white' : '#676767'
            }
          },
          tooltip: {},
          dataset: {
            dimensions: ['time_period', 'sale', 'goal'],
            source: [
              {time_period: 'Jan 2019', sale: 50, goal: 70},
              {time_period: 'Feb 2019', sale: 80, goal: 75},
              {time_period: 'Mar 2019', sale: 86, goal: 80},
              {time_period: 'Apr 2019', sale: 72, goal: 85}
            ]
          },
          xAxis: {
            type: 'category',
            // axisLabel: {
            //     rotate: 45
            // }
            axisLabel: {
              color: $q.dark.isActive ? 'white' : '#676767'
            }
          },
          yAxis: {
            // name: 'Goal',
            // nameLocation: 'center',
            // nameGap: 30,
            // nameTextStyle:{
            //     fontWeight: 'bold'
            // }
            axisLabel: {
              color: $q.dark.isActive ? 'white' : '#676767'
            }
          },
          series: [
            {type: 'bar', name: 'Sales'},
            {type: 'bar', name: 'Goals'}
          ]
        }
      );

        return { option };
      },
        data() {
            return {
                filter: '',
                mode: 'list',

                gaugeOptions: {
                    tooltip: {
                        formatter: '{a} <br/>{b} : {c}%'
                    },
                    series: [
                        {
                            type: 'gauge',
                            name: "Sale",
                            detail: {formatter: '{value}%'},
                            data: [{value: 30}],
                            min: 0,
                            radius: '100%',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: [[0.35, '#293c55'], [0.65, '#61a0a8'], [1, '#c23731']],
                                    width: 20
                                },
                            },

                        }
                    ]
                },
                columns: [
                    {name: 'activity_id', align: 'left', label: 'Activity ID', field: 'activity_id', sortable: true},
                    {
                        name: 'desc',
                        required: true,
                        label: 'Activity Name',
                        align: 'left',
                        field: row => row.name,
                        sortable: true
                    },
                    {name: 'regarding', align: 'left', label: 'Regarding', field: 'regarding', sortable: true},
                    {name: 'owner', align: 'left', label: 'Owner', field: 'owner', sortable: true},
                    {
                        name: 'creation_date',
                        align: 'left',
                        label: 'Creation Date',
                        field: 'creation_date',
                        sortable: true
                    }
                ],
                data: [
                    {
                        activity_id: "C001",
                        name: 'Advanced communications',
                        regarding: 'Presentation',
                        owner: 'John',
                        creation_date: '12-09-2019'
                    },
                    {
                        activity_id: "C002",
                        name: 'New drug discussion',
                        regarding: 'Meeting',
                        owner: 'John',
                        creation_date: '09-02-2019'
                    },
                    {
                        activity_id: "C003",
                        name: 'Universal services discussion',
                        regarding: 'Meeting',
                        owner: 'John',
                        creation_date: '03-25-2019'
                    },
                    {
                        activity_id: "C004",
                        name: 'Add on business',
                        regarding: 'Business',
                        owner: 'John',
                        creation_date: '03-18-2019'
                    },
                    {
                        activity_id: "C005",
                        name: 'Promotional Activity',
                        regarding: 'Personal',
                        owner: 'John',
                        creation_date: '04-09-2019'
                    },
                ],
                pagination: {
                    rowsPerPage: 10
                }
            }
        },
        computed: {
            barOptions() {
                return {
                    grid: {
                        bottom: '20%',
                        left: '15%',
                        top: '3%'
                    },
                    legend: {
                        bottom: 0,
                        textStyle: {
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    tooltip: {},
                    dataset: {
                        dimensions: ['time_period', 'sale', 'goal'],
                        source: [
                            {time_period: 'Jan 2019', sale: 50, goal: 70},
                            {time_period: 'Feb 2019', sale: 80, goal: 75},
                            {time_period: 'Mar 2019', sale: 86, goal: 80},
                            {time_period: 'Apr 2019', sale: 72, goal: 85}
                        ]
                    },
                    xAxis: {
                        type: 'category',
                        // axisLabel: {
                        //     rotate: 45
                        // }
                        axisLabel: {
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    yAxis: {
                        // name: 'Goal',
                        // nameLocation: 'center',
                        // nameGap: 30,
                        // nameTextStyle:{
                        //     fontWeight: 'bold'
                        // }
                        axisLabel: {
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    series: [
                        {type: 'bar', name: 'Sales'},
                        {type: 'bar', name: 'Goals'}
                    ]
                }
            },
            lineChartOption() {
                return {
                    grid: {
                        bottom: '20%',
                        left: '15%',
                        top: '3%'
                    },
                    legend: {
                        bottom: 0,
                        textStyle: {
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    tooltip: {
                        // formatter:
                        //     function (param) {
                        //     console.log(param)
                        //     // return param.seriesName + '<br />' + param.name + ': ';
                        // }
                    },
                    dataset: {
                        dimensions: ['product_name', 'share', 'growth'],
                        source: [
                            {product_name: 'Product A', share: 20, growth: 25},
                            {product_name: 'Product B', share: 22, growth: 18},
                            {product_name: 'Product C', share: 40, growth: 45}
                        ]
                    },
                    xAxis: {
                        type: 'category',
                        // axisLabel: {
                        //     rotate: 45
                        // }
                        axisLabel: {
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    yAxis: {
                        axisLabel: {
                            formatter: function (value, index) {
                                return value + ' %'
                            },
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    series: [
                        {type: 'line', name: 'Share'},
                        {type: 'line', name: 'Growth'}
                    ]
                }
            },
            pieOptions() {
                return {
                    tooltip: {
                        show: true
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 0,
                        width: 300,
                        textStyle: {
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    series: [
                        {
                            name: 'Competitor',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inner',
                                    formatter: function (param, index) {
                                        return param.value + ' %'
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            selectedMode: 'single',
                            data: [
                                {value: 40, name: 'Product 1', selected: true},
                                {value: 20, name: 'Competitor 1', selected: false},
                                {value: 15, name: 'Competitor 2', selected: false},
                                {value: 25, name: 'Competitor 3', selected: false},
                            ]
                        }
                    ]
                }
            },
            stackedBarOptions() {
                return {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer:
                            {
                                type: 'shadow'
                            },
                        backgroundColor: 'rgba(50,50,50,0.9)',

                    },
                    legend: {
                        bottom: 0,
                        textStyle: {
                            color: $q.dark.isActive ? 'white' : '#676767'
                        }
                    },
                    color: ['#3395dd', '#ed892d', '#34393b'],
                    // legend: {
                    //     y: "bottom",
                    //     data: [{name: 'Territory Sales', icon: 'circle'}, {
                    //         name: 'Remaining Nation Sales',
                    //         icon: 'circle'
                    //     }]
                    // },
                    grid:
                        {
                            bottom: '10%',
                            left: '15%',
                            top: '9%'
                        },
                    calculable: true,
                    xAxis:
                        {
                            type: 'value',
                            position:
                                'top',
                            axisLine:
                                {
                                    show: false
                                },
                            axisLabel: {
                                formatter: function (value, index) {
                                    return '$' + value;
                                },
                                color: $q.dark.isActive ? 'white' : '#676767'
                            }
                        },
                    yAxis: [
                        {
                            type: 'category',
                            data: ['Alex Morrow', 'Joanna Carter', 'Jimmy Joanna', 'Mack Hales'],
                            axisLabel: {
                                fontSize: 12,
                                color: $q.dark.isActive ? 'white' : '#676767'
                            }
                        }
                    ],
                    series:
                        [{
                            name: 'Qualification',
                            type: 'bar',
                            stack: 'A',
                            data: [300, 350, 400, 500]

                        }, {
                            name: 'Discovery',
                            type: 'bar',
                            stack: 'A',
                            data: [100, 180, 250, 300]

                        }, {
                            name: 'Quote',
                            type: 'bar',
                            stack: 'A',
                            data: [100, 120, 200, 220]

                        }]
                }
            }
        },
        methods: {
            SaveImage(type) {
                const linkSource = this.$refs[type].getDataURL();
                const downloadLink = document.createElement('a');
                document.body.appendChild(downloadLink);
                downloadLink.href = linkSource;
                downloadLink.target = '_self';
                downloadLink.download = type + '.png';
                downloadLink.click();
            },
            exportTable() {
                // naive encoding to csv format
                const content = [this.columns.map(col => wrapCsvValue(col.label))].concat(
                    this.data.map(row => this.columns.map(col => wrapCsvValue(
                        typeof col.field === 'function'
                            ? col.field(row)
                            : row[col.field === void 0 ? col.name : col.field],
                        col.format
                    )).join(','))
                ).join('\r\n')

                const status = exportFile(
                    'activity.csv',
                    content,
                    'text/csv'
                )

                if (status !== true) {
                    $q.notify({
                        message: 'Browser denied file download...',
                        color: 'negative',
                        icon: 'warning'
                    })
                }
            }
        }
    }
</script>

<style scoped>
  .blue_dark {
    background-color: #082f56;
  }

  .green_dark {
    background-color: #084a0b;
  }

  .orange_dark {
    background-color: #64350e;
  }
</style>
