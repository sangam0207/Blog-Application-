import {useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom'
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';
import DashPosts from '../components/DashPosts';
const Dashboard = () => {
  const location=useLocation();
  const[tab,setTab]=useState('');
  console.log(location);
  useEffect(()=>{
    console.log(location.search)
    
  const urlParams=new URLSearchParams(location.search);
  //console.log(urlParams)
  const tabFromUrl=urlParams.get('tab');
  //console.log(tabFromUrl)
  if(tabFromUrl){
    setTab(tabFromUrl);
  }
  },[location.search])
  //console.log(tab)
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'>
      {/* Sidebar */}
      <DashSidebar />
    </div>
    {/* profile... */}
    {tab === 'profile' && <DashProfile />}
    {/* posts... */}
     {tab==='posts' && <DashPosts/>}
  </div>
  )
}

export default Dashboard