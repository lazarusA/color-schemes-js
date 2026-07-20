# Function Index

Summary reference of exported functions and data structures provided by `color-schemes-js`:

<table>
<thead>
  <tr>
    <th align="left">
      Export / API
    </th>
    
    <th align="left">
      Description
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td align="left">
      <code>
        colorschemes
      </code>
    </td>
    
    <td align="left">
      Registry dictionary object containing all pre-defined <code>
        ColorScheme
      </code>
      
       instances.
    </td>
  </tr>
  
  <tr>
    <td align="left">
      <code>
        ColorScheme
      </code>
    </td>
    
    <td align="left">
      Constructor for creating new colorscheme instances from arrays of colors.
    </td>
  </tr>
  
  <tr>
    <td align="left">
      <code>
        get(scheme, t)
      </code>
    </td>
    
    <td align="left">
      Sample a scheme continuously at position <code>
        t
      </code>
      
       $\in <span>
        0.0, 1.0
      </span>
      
      $.
    </td>
  </tr>
  
  <tr>
    <td align="left">
      <code>
        resample(scheme, n)
      </code>
    </td>
    
    <td align="left">
      Generate a new <code>
        ColorScheme
      </code>
      
       by resampling an existing scheme with $n$ steps.
    </td>
  </tr>
  
  <tr>
    <td align="left">
      <code>
        findcolorscheme(query)
      </code>
    </td>
    
    <td align="left">
      Search pre-defined scheme names, categories, and notes matching a search string or regular expression.
    </td>
  </tr>
  
  <tr>
    <td align="left">
      <code>
        getInverse(scheme, color)
      </code>
    </td>
    
    <td align="left">
      Inverse lookup: find normalized position $t \in <span>
        0.0, 1.0
      </span>
      
      $ corresponding to closest matching color in a scheme.
    </td>
  </tr>
</tbody>
</table>
