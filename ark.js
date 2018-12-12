/** Config */
const VERSION = '0.12.12_1811'
console.log('version', VERSION)

const API_HOST = 'https://explorer.ark.io'
const ARK = new ArkEcosystemClient(API_HOST, 2)

const TX_TYPES = []
TX_TYPES[0] = { label: 'Transfer', limit: 500 }
TX_TYPES[1] = { label: 'Second signature', limit: 100 }
TX_TYPES[2] = { label: 'Delegate registration', limit: 100 }
TX_TYPES[3] = { label: 'Vote', limit: 100 }

const default_option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0] - 85, '10%'];
    }
  },
  title: {
    left: 'center',
    text: 'Fees',
  },
  toolbox: {
    feature: {
      saveAsImage: { title: 'Save' }
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [{
    type: 'inside',
    start: 80,
    end: 100
  }, {
    start: 80,
    end: 100,
    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '80%',
    handleStyle: {
      color: '#fff',
      shadowBlur: 3,
      shadowColor: 'rgba(0, 0, 0, 0.6)',
      shadowOffsetX: 2,
      shadowOffsetY: 2
    }
  }],
  series: [
    {
      name: 'Fee',
      type: 'line',
      smooth: true,
      symbol: 'none',
      sampling: 'average',
      itemStyle: {
        color: 'rgb(255, 25, 45)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(200, 25, 45)'
        }, {
          offset: 1,
          color: 'rgb(255, 25, 45)'
        }])
      },
      data: []
    },
    {
      name: '',
      type: 'line',
      smooth: true,
      symbol: 'none',
      sampling: 'average',
      itemStyle: {
        color: 'rgb(255, 25, 45)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgb(200, 25, 45)'
        }, {
          offset: 1,
          color: 'rgb(255, 25, 45)'
        }])
      },
      data: []
    }
  ]
}
/** Config */

async function getTransactions(type, limit) {
  const pages = (limit > 100) ? Math.ceil(limit / 100) : 1
  limit = (limit > 100) ? 100 : limit
  let data = []

  for (let page = 1; page <= pages; page++) {
    const url = `transactions?limit=${limit}&page=${page}`
      + (type >= 0 ? '&type=' + type : '')

    console.log(`Querying API: ${API_HOST}/api/v2/${url}`)
    try {
      const response = await ARK.http.get(url)
      if (response.data.meta.count) {
        data = data.concat(response.data.data);
      }
    } catch (e) {
      console.error(`Can't get data from: ${API_HOST}/api/v2/${url}`, e)
    }
  }

  return data.reverse()
}

function formatDate(timestamp) {
  return new Date(timestamp.human).toLocaleString()
}

function formatFee(fee) {
  return (+fee / 1e8).toLocaleString('en', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8,
  })
}