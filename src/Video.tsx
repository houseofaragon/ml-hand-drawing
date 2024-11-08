import { forwardRef, useEffect } from "react"

const Video = forwardRef(({ deviceId = '', width = 340, height = 340}, ref) => {
    useEffect(() => {
        const getVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId, width, height }
                });
    
                if (ref.current) {
                    ref.current.srcObject = stream;
                    await ref.current.play();
                }
            } catch (error) {
                console.log('Error accessing webcam: ', error);
            }
        };
    
        getVideoStream();
    
        // Cleanup function to stop video stream on component unmount
        return () => {
            if (ref.current && ref.current.srcObject) {
                const tracks = ref.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
                ref.current.srcObject = null;
            }
        };
    }, [deviceId, width, height]);
    

    return (
        <video
            id="video-stream"
            ref={ref}
            autoPlay
            playsInline
        />
    )
})

export default Video