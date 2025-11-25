import { getInitials } from '../utils/helpers';

const Avatar = ({ src, alt, size = 'md', className = '' }) => {
    const sizeClass = `avatar-${size}`;

    if (src) {
        return (
            <img
                src={src}
                alt={alt || 'Avatar'}
                className={`avatar ${sizeClass} ${className}`}
            />
        );
    }

    return (
        <div className={`avatar ${sizeClass} ${className}`}>
            {getInitials(alt || 'User')}
        </div>
    );
};

export default Avatar;
