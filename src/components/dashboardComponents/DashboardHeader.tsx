import { FC } from 'react'
import './dashboardCSS/dashboardComponents.css'
import User from '../../backend/User'
// @author Robert Roach

interface DashboardHeaderProps {
    updateCurrentUser: (user: User | null) => void,
    user: User,
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ updateCurrentUser, user }) => {

    return (
        <div className='dashboard-header'>
            <div className='dashboard-title'>AARCS Husksheets Dashboard</div>
            <div className='header-right-side'>
                <div className='username'>{user.getUserName()}</div>
                <button 
                    className='logout-button'
                    name='logout'
                    onClick={() => updateCurrentUser(null)}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default DashboardHeader