import { useState } from "react"
// Wrap children around a togglable element. The toggle is controlled with a passable value.
// By default, hide the component from the user.

type Props = {
    initialValue?: true | false
    children: string | JSX.Element | JSX.Element[]
    className?: string
}

function ToggleWrapper(props: Props) {
    const [show, setShow] = useState(props.initialValue || true)

    return (
        <div className={ `toggle-wrapper ${ props.className } ` + (show) ? "" : "hide" } aria-hidden={ !show }>
            { props.children }
        </div>
    )
}

export default ToggleWrapper