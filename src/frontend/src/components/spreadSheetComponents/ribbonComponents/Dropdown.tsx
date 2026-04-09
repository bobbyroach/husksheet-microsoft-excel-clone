import { FC, useRef, useState } from 'react'
import { Functions } from '../../../utils/types'
// @author Robert Roach

interface DropdownProps {
    buttonLabel: string,
    listItems: Functions[] | string[],
}

const Dropdown: FC<DropdownProps> = ({ buttonLabel, listItems }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    // Closes dropdown if click elsewhere on page
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false)
        }
    }

    return (
        <div 
            className="functions-dropdown"
            ref={dropdownRef} 
            onBlur={handleBlur}
        >
            <button 
                className="dropdown-toggle function-row-boxes" 
                onClick={toggleDropdown}
            >
                {buttonLabel}
                <div className={`arrow ${isOpen ? 'down' : 'up' }`} />
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {listItems.map((item, index) => (
                        <button key={index} 
                            className="dropdown-item"
                            onClick={() => { 
                                setIsOpen(false)
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dropdown
