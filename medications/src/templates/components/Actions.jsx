import React from "react"
import { GameController } from "phosphor-react"

export function Actions({actions}) {
    return (
        <div className="actions">
            <GameController size={32} />
            <div className="action-list">

            {actions.map(([action, icon]) => {
                return (
                    <div key={action} className='action'>
                        <div className='action-icon'>
                            {icon}
                        </div>
                        <div>
                            {action}
                        </div>
                    </div>
                    )
                })}
            </div>
        </div>
    )
}