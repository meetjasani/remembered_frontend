import { useState } from 'react'

const ReadMore = ({ children }: any, fontStyle: string) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
        <p className={fontStyle}>
             {isReadMore ? text.slice(0, 20) : text}
            <u>
                <span onClick={toggleReadMore} className="font-16-bold color-dark cursor-p">
                    {isReadMore && (isReadMore ? "Show All" : " Show Less")}
                </span>
            </u>
        </p>
    );
};

export default ReadMore;
