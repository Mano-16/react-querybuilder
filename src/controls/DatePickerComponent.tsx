import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'react-modern-calendar-datepicker';

interface DatePickerComponentProps {
  handleOnChange?: () => void;
  setSelectedDay?: (e) => void;
  onDateChange?: (obj) => void;
  setCalendar: (v: boolean) => any;
  isTodaySelected?: boolean;
  onTodaysDateChange?: () => void;
  onSelectDateChange?: () => void;
}

const renderFooter = (props) => {
  const { isTodaySelected, onTodaysDateChange } = props;
  return (
    <label className="label-container">
      <input
        role="radio"
        type="radio"
        value={''}
        aria-checked={isTodaySelected}
        checked={isTodaySelected}
        onChange={onTodaysDateChange}
      />
      <span className="footer-text">{'Current date'}</span>
    </label>
  );
};

const renderHeader = (props) => {
  const { isTodaySelected, onSelectDateChange } = props;
  return (
    <label className="label-container">
      <input
        role="radio"
        type="radio"
        value={''}
        aria-checked={!isTodaySelected}
        checked={!isTodaySelected}
        onChange={onSelectDateChange}
      />
      <span className="footer-text">{'Select date'}</span>
    </label>
  );
};

const renderDatePicker = (props) => {
  const { handleOnChange, setSelectedDay, onDateChange, setCalendar } = props;

  const onChange = (d) => {
    onDateChange(d, setSelectedDay, handleOnChange);
    setCalendar(false);
  };

  return (
    <div className="date-filter-wrapper">
      <Calendar
        onChange={onChange}
        shouldHighlightWeekends
        colorPrimary="#0078d4"
        colorPrimaryLight="#0078d41c"
      />
    </div>
  );
};

const DatePickerComponent: React.FC<DatePickerComponentProps> = (props) => {
  const { setCalendar } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [st, setSt] = useState<React.CSSProperties>({ right: '23px' });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef && cardRef.current) {
        const ref: any = cardRef.current;
        if (!ref.contains(e.target) && !e.target.classList.contains('Calendar__day'))
          setCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (cardRef.current) {
      const cardEle = cardRef.current.getBoundingClientRect();
      const inputRef = cardRef.current.closest('.date-input-container')?.getBoundingClientRect();
      const parentRef = cardRef.current.closest('.mrx-modal-container')?.getBoundingClientRect();

      if (parentRef && inputRef) {
        if (cardEle.top + cardEle.height > parentRef.top + parentRef.height)
          setSt({ ...st, bottom: `${inputRef.height}px` });
      }
    }
  }, [cardRef]);

  return (
    <div ref={cardRef} className="date-modal-container" style={st && st}>
      {renderHeader(props)}
      {renderDatePicker({ ...props, setCalendar })}
      {renderFooter(props)}
    </div>
  );
};

DatePickerComponent.displayName = 'DatePickerComponent';

export default DatePickerComponent;
