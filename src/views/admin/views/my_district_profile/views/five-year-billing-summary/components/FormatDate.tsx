

export function formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
  
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) return '';
  
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  }
  
  interface DateFormatterProps {
    dateString: string | undefined;
  }
  
  const DateFormatter: React.FC<DateFormatterProps> = ({ dateString }) => {
    return <>{formatDate(dateString)}</>;
  };
  
  export default DateFormatter;