import React, { useEffect, useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import SearchBox from "../SearchBox"
import { useStore } from "../../stores/global"
import { observer } from "mobx-react"
import Header from "../Header"
import Grid from "@material-ui/core/Grid"
import FAQ from "../FAQ"

export default observer(props => {
  const store = useStore()
  const [Chart, setChart] = useState(null)

  let data = useStaticQuery(graphql`
    query {
      allTownDataCsv {
        nodes {
          childStats {
            town
            counts {
              dateStr
              shortDateStr
              totalCount
              changePer100k
              changeSinceLastCount
              twoCountAverageChange
            }
          }
        }
      }
    }
  `)

  let names = []

  data = data.allTownDataCsv.nodes.map(node => {
    names.push(node.childStats.town)
    return node.childStats
  })

  useEffect(() => {
    store.setTownCounts(data)
    store.setTownNames(names)
  }, [data, names, store])

  useEffect(() => {
    if (typeof window !== undefined) {
      import("../Chart").then(mod => {
        setChart(mod.default)
      })
    }
  }, [])

  return (
    <>
      <Grid container spacing={2} style={{ padding: 20 }}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
          <SearchBox />
        </Grid>
        <Grid item xs={12}>
          {Chart ? <Chart /> : <div style={{ height: "75vh" }} />}
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            marginTop: 50,
          }}
        >
          <FAQ />
        </Grid>
      </Grid>
    </>
  )
})
