import moment from 'moment'
import { useEffect, useState } from 'react'
import { getXYZ } from 'services'

export default function useScrollTable(limit, date, page) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [data, setData] = useState([])

  const getXYZCounts = () => {
    const params = {
      from_date:  date
      ? date?.from_date
      : moment().subtract(1, 'year').format('YYYY-MM'),
      to_date: date
      ? date?.to_date
      : moment().format('YYYY-MM'),
      page: page,
      limit: limit
    }
    getXYZ(params).then((res) => {
      if(date && page === 1){
        setData(res?.Products)
      }else{
        setData((state) => [...state, ...res?.Products]);
      }
      setHasMore(res?.Products?.length > 0)
      setLoading(false);
      
    });
  }

  useEffect(() => {
    setLoading(true)
    setError(false)
    
    getXYZCounts()
  }, [limit, date, page])
  
  

  return { loading, error, data, hasMore }
}