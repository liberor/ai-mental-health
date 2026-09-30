
import { Alert, Button } from "antd"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Suitable() {
    const [devicePixelRatio, setDevicePixelRatio] = useState(() => window.devicePixelRatio)
    const [w, setW] = useState(() => window.innerWidth)
    const [h, setH] = useState(() => window.innerHeight)
    const Nav = useNavigate()
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 1900 && window.innerWidth < 2600) {
                Nav('/', { replace: true })
            }
            setW(window.innerWidth)
            setH(window.innerHeight)
            setDevicePixelRatio(window.devicePixelRatio)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    return (
        <div className="h-[100vh] flex flex-col justify-center items-center">
            <Alert
                title={<div className="text-[1.2vw] font-bold">请调整您的分辨率</div>}
                showIcon
                description={<>
                    <div className="text-[1.2vw] ">{`当前分辨率为${w}*${h}`}</div>
                    <div className="text-[1.2vw] ">{`当前系统和浏览器缩放比为${devicePixelRatio.toFixed(2)}`}</div>
                    <div className="text-[1.2vw] ">{`很抱歉该网页目前只适配了2560*1440,1920*1080,请调整您的分辨率`}</div></>}
                type="error"
            />

        </div>
    )
}
