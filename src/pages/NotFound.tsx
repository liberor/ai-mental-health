import {Alert,Avatar} from "antd"
import sad from '@/assets/images/悲伤.png'
import './NotFound.css'
export default function NotFound() {
    return (
        <div className="flex flex-col items-center pt-[24vh] text-3xl font-bold">
            <Avatar src={sad} size={120}></Avatar>
            <Alert
                style={{width:'20vw',height:'12vh',marginTop:'6vh'}}
                title="404 NotFound"
                description="您查找的页面不存在"
                type="error"
                
            />
        </div>
    )
}
