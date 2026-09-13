

interface GardenDotsProps {
    riskLevel:number
}


export default function GardenDots({riskLevel}:GardenDotsProps) {
    return (
        <>
            <span className={riskLevel >= 3 ? 'emotion-info-dot-bad':'emotion-info-dot'} style={{marginRight:'5px'}}></span>
            <span className={riskLevel >= 2 ? 'emotion-info-dot-bad':'emotion-info-dot'} style={{marginRight:'5px'}}></span>
            <span className={riskLevel >= 1 ? 'emotion-info-dot-bad':'emotion-info-dot'} style={{marginRight:'5px'}}></span>
        </>
    )
}
