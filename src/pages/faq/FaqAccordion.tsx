import React from 'react'


interface props {
    SrNo: Number,
    title: string,
    children: string,
    faqOpen: boolean[],
    index: number,
    setFaqOpen: any
}
const FaqAccordion: React.FC<props> = (props) => {

    const OpenFaq = (index: number) => {
        // let temp = [...props.faqOpen];
        let open = []
        for (let i = 0; i <= props.faqOpen.length; i++) {
            open.push(false)
        }
        open[index] = true
        props.setFaqOpen(open)
    }

    return (
        <div className="accordion-wrapper">

            <div
                className={`d-flex accordion-title cursor-pointer ${props.faqOpen[props.index] ? "open" : ""}`}
                onClick={() => OpenFaq(props.index)}
            >
                <div className="head-faq-accordian-srno">
                    {props.SrNo}
                </div>
                <div className="head-faq-accordian-title">
                    {props.title}
                </div>
            </div>
            <div className={`accordion-item ${!props.faqOpen[props.index] ? "collapsed" : ""}`}>
                <div className="accordion-content">{props.children}</div>
            </div>
        </div>
    );
};

export default FaqAccordion
