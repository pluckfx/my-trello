import React, { useState } from 'react'
import '../App/App.scss'

export const App = () => {
    const [title, setTitle] = useState('')
    const [itemTitle, setItemTitle] = useState('')
    const [cards, setCards] = useState([
      {id: 1, order: 1, isChange: false, isVal: false, title: 'Column-1', data: []},
      {id: 2, order: 2, isChange: false, isVal: false, title: 'Column-2', data: []},
    ])
    const [currentCard, setCurrentCard] = useState()
    const [currentItem, setCurrentItem] = useState()
    const [cardCurrentCard, setCardCurrentCard] = useState()

    const addColumn = (id) =>{
      if(title.trim()){
        cards.push({id: id, order: id, isChange: false, isVal: false, title: title.trim(), data: []})
        setTitle('')
      }else{
        alert('Пожалуйста, введите название колонки')
      }
    }

    const addItem = (id) =>{
      if(!itemTitle.trim()){
        alert('Пожалуйста, введите название карточки')
        return
      }

      cards.map(card=>{
        if(card.id === id){
          return(
            {...card, data: card.data.push({title: itemTitle.trim(), isChanged: false, id: Date.now()})}
          ) 
        }
        return card
      })
      setItemTitle('')
      setCards(cards.map(card=>{
        if(card.id === id){
          return {...card, isVal: false}
        }
        return card
      }))
    }

    function dragOverHandler(e){
      e.preventDefault()
    }

    function dragStartHandler(e, card, item){
      setCurrentCard(card)
      setCurrentItem(item)
    }

    function dragCardStartHandler(e, card){
      setCardCurrentCard(card)
    }

    function dropHandler(e, card, item){
      e.preventDefault()
      if(!currentItem) return
      
      const currentInd = currentCard.data.indexOf(currentItem)
      currentCard.data.splice(currentInd, 1)
      const addInd = card.data.indexOf(item)
      card.data.splice(addInd + 1, 0, currentItem)
      
      setCards(cards.map(obj=>{
        if(obj.id === currentCard.id){
          return currentCard
        }
        if(obj.id === card.id){
          return card
        }
        return obj
      }))
    }

    function dropCardBlockHandler(e, card){
      if(!currentItem || currentCard === card) return
      
      card.data.push(currentItem)
      const currentInd = currentCard.data.indexOf(currentItem)
      currentCard.data.splice(currentInd, 1)
      
      setCards(cards.map(obj=>{
        if(obj.id === card.id){
          return card
        }
        if(obj.id === currentCard.id){
          return currentCard
        }
        return obj
      }))
    }

    function dropCardHandler(e, card){
      e.preventDefault()
      if(!cardCurrentCard || cardCurrentCard.id === card.id) return
      
      setCards(cards.map(obj=>{
        if(obj.id === card.id){
          return {...obj, order: cardCurrentCard.order}
        }
        if(obj.id === cardCurrentCard.id){
          return {...obj, order: card.order}
        }
        return obj
      }))
    }

    const sortCards = (a, b) => {
      if(a.order > b.order){
        return 1
      }else{
        return -1
      }
    }

    const deleteCard = (id) =>{
      if(window.confirm('Удалить колонку?')){
        setCards(cards.filter(el => el.id !== id))
      }
    }

    const deleteItem = (itemId) =>{
      if(window.confirm('Удалить карточку?')){
        setCards(cards.map(el=> (
          {...el, data: el.data.filter(t => t.id !== itemId)}
        )))
      }
    }

    const changeCard=(id)=>{
      setCards(cards.map(card=>{
        if(card.id === id){
          return {...card, isChange: true}
        }
        return card
      }))
    }

    const getChangedCard=(e, id, text)=>{
      if(e.key === 'Enter' && text.trim()){
        setCards(cards.map(card=>{
          if(card.id === id){
            return {...card, title: text.trim(), isChange: false}
          }
          return card
        }))
      }
    }

    const changeItem = (itemId) =>{
      setCards(
        cards.map(card=>{
          let timeArr = []
          timeArr =
          card.data.map(item=>{
            if(item.id === itemId){
              return {...item, isChanged: true}
            }
            return item
          })
          return {...card, data: timeArr}
        })
      )
    }

    const getChangedItem=(e, itemId, desc)=>{
      if(e.key === 'Enter' && desc.trim()){
        setCards(cards.map(card=>{
          let timeArr = []
          timeArr =
          card.data.map(item=>{
            if(item.id === itemId){
              return {...item, title: desc.trim(), isChanged: false}
            }
            return item
          })
          return {...card, data: timeArr}
        }))
      }
    }

    const resetInp = (id) =>{
      setCards(cards.map(card=>{
        if(card.id === id){
          return {...card, isVal: true}
        }
        return card
      }))
    }

    const [isDrag, setIsDrag] = useState()

  return (
    <div className='trello'>
      <div className='trello__header'>
        <h1 className='trello__header-title'>Trello Clone</h1>
        <p className='trello__header-subtitle'>Управляйте своими задачами</p>
      </div>
      <div className='trello__container'>
        {cards.sort(sortCards).map((card, ind)=>{
          return(
            <div key={card.id} className='trello__block' 
              onDragOver={(e)=>{ isDrag ? dragOverHandler(e) : console.log()}}
              onDrop={(e)=>{isDrag ? dropCardBlockHandler(e, card) : console.log()}}
            >
              <div className="trello__title"
                onMouseEnter={() => {setIsDrag(false)}}
                onMouseLeave={() => setIsDrag(true)}
                onDragStart={(e)=>{dragCardStartHandler(e, card)}}
                draggable={true}
                onDragOver={(e)=>{dragOverHandler(e)}}
                onDrop={(e)=>{dropCardHandler(e, card)}}
              >
                {card.isChange ? 
                  <input
                    autoFocus
                    defaultValue={card.title}
                    onKeyPress={(e)=>{getChangedCard(e, card.id, e.target.value)}}
                    onBlur={(e) => {
                      setCards(cards.map(c => 
                        c.id === card.id ? {...c, isChange: false} : c
                      ))
                    }}
                    type="text"
                    className='trello__title-input'
                  /> : 
                  <span className='trello__title-text'>{card.title}</span>
                }
                <div className="trello__card_btns">
                  <button className="trello__card_change" onClick={()=>{changeCard(card.id)}}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53615C22.0669 3.85987 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.034 5.24635 21.8895 5.5635C21.745 5.88065 21.5378 6.16524 21.2799 6.40005V6.40005Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M11 4H6C4.93913 4 3.92172 4.42142 3.17157 5.17157C2.42143 5.92172 2 6.93913 2 8V18C2 19.0609 2.42143 20.0783 3.17157 20.8284C3.92172 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button className="trello__card_del" onClick={()=>{deleteCard(card.id)}}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M10 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M14 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M18 6V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V6" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                </div>
              </div>
              {card.data.map(item => {
                return(
                  <div
                    key={item.id}
                    draggable={true}
                    onDragOver={(e)=>{dragOverHandler(e)}}
                    onDrop={(e)=>{dropHandler(e, card, item)}}
                    onDragStart={(e)=>{dragStartHandler(e, card, item)}}
                    className="trello__item"
                  >
                    {item.isChanged ? 
                      <input 
                        autoFocus
                        defaultValue={item.title}
                        type="text" 
                        onKeyPress={(e)=>{getChangedItem(e, item.id, e.target.value)}}
                        onBlur={(e) => {
                          setCards(cards.map(c => ({
                            ...c,
                            data: c.data.map(i => 
                              i.id === item.id ? {...i, isChanged: false} : i
                            )
                          })))
                        }}
                        className='trello__item-input'
                      /> : 
                      <span className='trello__item-text'>{item.title}</span>
                    }
                    <div className="trello__item_btns">
                      <button onClick={()=>{changeItem(item.id)}} className="trello__item_change">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53615C22.0669 3.85987 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.034 5.24635 21.8895 5.5635C21.745 5.88065 21.5378 6.16524 21.2799 6.40005V6.40005Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11 4H6C4.93913 4 3.92172 4.42142 3.17157 5.17157C2.42143 5.92172 2 6.93913 2 8V18C2 19.0609 2.42143 20.0783 3.17157 20.8284C3.92172 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="trello__item_del" onClick={()=>{deleteItem(item.id)}}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M10 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M14 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M18 6V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V6" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
              <div className="trello__item trello__item-add">
                {card.isVal ?
                  <label className="trello__item_label">
                    <input 
                      value={itemTitle} 
                      onChange={(e)=>{setItemTitle(e.target.value)}} 
                      className="trello__item_inp" 
                      placeholder="Введите название карточки"
                      type="text"
                      autoFocus
                    />
                    <button onClick={()=>{addItem(card.id)}} className="trello__item_btn">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </label> : 
                  <button onClick={()=>{resetInp(card.id)}} className="trello__add">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Добавить карточку
                  </button>
                }
              </div>
            </div>
          )
        })}
        <div className="trello__block trello__block-add">
          <label className='trello__card_label'>
            <input 
              value={title} 
              onChange={(e)=>{setTitle(e.target.value)}} 
              className='trello__card_inp' 
              placeholder='Введите название колонки' 
              type="text" 
            />
            <button onClick={()=>{addColumn(cards.length+1)}} className='trello__card_btn'>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </label>
        </div>
      </div>
    </div>
  )
}
