import { CodeArea } from "web3uikit"

export default function Output(props) {
    console.log(props.text)
    return (
        <nav className="flex flex-row">
            <div className="py-10 w-full ">
                <CodeArea text={props.text} maxWidth="1000px" />
            </div>
        </nav>
    )
}
